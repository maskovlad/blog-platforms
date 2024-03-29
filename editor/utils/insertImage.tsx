import { Editor, Node, Transforms } from "slate"
import isUrl from 'is-url'
import { ParagraphElement } from "@/types/editor"
import imageExtensions from 'image-extensions'
import { toast } from "react-hot-toast"

/**
 * функція вставки блока з зображенням у редактор Slate
 * @param editor Editor
 * @param url string
 * @returns void | false при помилці
 */
export const insertImage = (editor, url, href="", float="") => {
  const text = { text: '' }
  const paragraph: ParagraphElement = { type: 'paragraph', children: [text] }
  const img: HTMLImageElement = new Image()
  // console.log({ url })

  if (!(img.onerror = (error) => {
    console.log("ONERROR: ", error)
    toast.error("Помилка вставки зображення. Спробуйте зберегти зображення на свій компьютер і перетягнути у потрібне місце в дописі.", {duration:10000})
    return false
  })) return false

  img.onload = () => {
    const image = {
      type: 'image',
      url,
      href,
      width: img.naturalWidth,
      height: img.naturalHeight,
      ratio: img.naturalWidth / img.naturalHeight,
      float,
      children: [text]
    }

    const isEnd = !Editor.next(editor)
    // @ts-ignore
    if (isEnd) { Transforms.insertNodes(editor, [image, paragraph]) } else { Transforms.insertNodes(editor, image) }
  }

  img.src = url
}


/**
 * функція для перевірки чи не є часом url картинкою
 * @param url string
 * @returns boolean
 */
export const isImageUrl = async (url: string | URL) => {

  if (!url) return false
  if (!isUrl(url)) return false
  console.log("Start isImageUrl")

  // перевіка по розширенню файла, якщо воно є
  const ext = new URL(url).pathname.split('.').pop() as string
  if (imageExtensions.includes(ext)) {
    console.log({ imageExtensions: "Its imageExtensions" })
    return true
  }

  // якщо немає розширення - запит fetch з перевіркою заголовків
  let response: Response
  try {
    console.log("Fetch для перевірки, чи посилання є зображенням")
    response = await fetch(url, {
      // method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: 'same-origin', // include, *same-origin, omit
      // // headers: {
      // //   'Content-Type': 'image/*'
      // //   // 'Content-Type': 'application/x-www-form-urlencoded',
      // // },
      // referrerPolicy: 'no-referrer', // no-referrer, *client
    })
  } catch (error) {
    console.log(error)
    return false
  }

  const isHeaderContentTypeImage = response.headers.get("Content-Type")?.startsWith("image") ? true : false

  return isHeaderContentTypeImage
}

/* варіант функції з класом Image

export const isImageUrl = async (url: string | URL) => {
  // console.log({url})
  if (!url) return false
  if (!isUrl(url)) return false
  const ext = new URL(url).pathname.split('.').pop() as string

  if (imageExtensions.includes(ext)) {
    console.log({ imageExtensions: "imageExtensions" })
    return true
  }


  const testUrl = new Promise((resolve, reject) => {
    var img = new Image();

    img.onerror = () => {
      console.log("onerror")
      resolve(false)
    }

    img.onload = () => {
      console.log("onload")
      resolve(true)
    }

    img.crossOrigin = "Anonymous"
    img.src = url as string;
  })

  // testUrl.then(
  // result => {
  //   console.log({ result })
  //   return result
  // },
  // reject => {
  //   console.log({ reject })
  //   return reject
  // })
  return await testUrl

}

*/
