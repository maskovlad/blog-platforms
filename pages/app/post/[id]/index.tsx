import TextareaAutosize from "react-textarea-autosize";
import toast from "react-hot-toast";
import useSWR, { mutate } from "swr";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback, useMemo, PropsWithChildren, ReactNode } from "react";
import type { ChangeEvent } from "react";

import Layout from "@/components/app/Layout";
import Loader from "@/components/app/Loader";
import LoadingDots from "@/components/app/loading-dots";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";
import type { WithSitePost } from "@/types";

import isHotkey from 'is-hotkey'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import {
  Editor,
  Transforms,
  createEditor,
  Descendant,
  Element as SlateElement,
  BaseElement,
} from 'slate'
import { withHistory } from 'slate-history'
import { CustomEditor, CustomElement, CustomText } from "@/types/editor";

import { Button, Icon, Toolbar } from '@/components/editor/components'

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

interface PostData {
  title: string;
  description: string;
  content: Descendant[];
}



export default function Post() {

  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor: CustomEditor = useMemo(() => withHistory(withReact(createEditor())), [])

  const router = useRouter();

  // TODO: Undefined check redirects to error
  const { id: postId } = router.query;

  const { data: post, isValidating } = useSWR<WithSitePost>(
    router.isReady && `/api/post?postId=${postId}`,
    fetcher,
    {
      dedupingInterval: 1000,
      onError: () => router.push("/"),
      revalidateOnFocus: false,
    }
  );

  const [publishing, setPublishing] = useState(false);
  const [disabled, setDisabled] = useState(true);


  const [savedState, setSavedState] = useState(
    post
      ? `Last saved at ${Intl.DateTimeFormat("en", { month: "short" }).format(
        new Date(post.updatedAt)
      )} ${Intl.DateTimeFormat("en", { day: "2-digit" }).format(
        new Date(post.updatedAt)
      )} ${Intl.DateTimeFormat("en", {
        hour: "numeric",
        minute: "numeric",
      }).format(new Date(post.updatedAt))}`
      : "Saving changes..."
  );

  // стейт для всіх даних посту
  const [data, setData] = useState<PostData>({
    title: "",
    description: "",
    content: [],
  });

  useEffect(() => {
    if (post) // from useSWR
      setData({
        title: post.title ?? "",
        description: post.description ?? "",
        content: post.content as Descendant[] ?? null,   //? не знаю чи правильно "as Descendant[]"
      });
  }, [post]);

  const [debouncedData] = useDebounce(data, 1000);

  const saveChanges = useCallback(
    async (data: PostData) => {
      setSavedState("Saving changes...");

      try {
        const response = await fetch("/api/post", {
          method: HttpMethod.PUT,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: postId,
            title: data.title,
            description: data.description,
            content: data.content,
          }),
        });

        if (response.ok) {
          const responseData = await response.json();
          setSavedState(
            `Last save ${Intl.DateTimeFormat("en", { month: "short" }).format(
              new Date(responseData.updatedAt)
            )} ${Intl.DateTimeFormat("en", { day: "2-digit" }).format(
              new Date(responseData.updatedAt)
            )} at ${Intl.DateTimeFormat("en", {
              hour: "numeric",
              minute: "numeric",
            }).format(new Date(responseData.updatedAt))}`
          );
        } else {
          setSavedState("Failed to save.");
          toast.error("Failed to save");
        }
      } catch (error) {
        console.error(error);
      }
    },
    [postId]
  );

  useEffect(() => {
    if (debouncedData.title) saveChanges(debouncedData);
  }, [debouncedData, saveChanges]);

  useEffect(() => {
    if (data.title && data.description && data.content && !publishing)
      setDisabled(false);
    else setDisabled(true);
  }, [publishing, data]);

  useEffect(() => {
    function clickedSave(e: KeyboardEvent) {
      let charCode = String.fromCharCode(e.which).toLowerCase();

      if ((e.ctrlKey || e.metaKey) && charCode === "s") {
        e.preventDefault();
        saveChanges(data);
      }
    }

    window.addEventListener("keydown", clickedSave);

    return () => window.removeEventListener("keydown", clickedSave);
  }, [data, saveChanges]);

  async function publish() {
    setPublishing(true);

    try {
      const response = await fetch(`/api/post`, {
        method: HttpMethod.PUT,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: postId,
          title: data.title,
          description: data.description,
          content: data.content,
          published: true,
          subdomain: post?.site?.subdomain,
          customDomain: post?.site?.customDomain,
          slug: post?.slug,
        }),
      });

      if (response.ok) {
        mutate(`/api/post?postId=${postId}`);
        router.push(
          `${process.env.NEXT_PUBLIC_SITE_PROTOCOL}${post?.site?.subdomain}.${process.env.NEXT_PUBLIC_SITE_URL}/${post?.slug}`
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPublishing(false);
    }
  }

  if (isValidating)
    return (
      <Layout>
        <Loader />
      </Layout>
    );

  return (
    <>
      <Layout siteId={post?.site?.id}>
        <div className="max-w-screen-xl mx-auto px-10 sm:px-20 mt-10 mb-16">
          <TextareaAutosize
            name="title"
            onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setData({
                ...data,
                title: (e.target as HTMLTextAreaElement).value,
              })
            }
            className="w-full px-2 py-4 text-gray-800 placeholder-gray-400 mt-6 text-5xl font-cal resize-none border-none focus:outline-none focus:ring-0"
            placeholder="Untitled Post"
            value={data.title}
          />
          <TextareaAutosize
            name="description"
            onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setData({
                ...data,
                description: (e.target as HTMLTextAreaElement).value,
              })
            }
            className="w-full px-2 py-3 text-gray-800 placeholder-gray-400 text-xl mb-3 resize-none border-none focus:outline-none focus:ring-0"
            placeholder="No description provided. Click to edit."
            value={data.description}
          />

          <div className="relative mb-6">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300" />
            </div>
          </div>


          <Slate editor={editor} value={initialValue}>
            <Toolbar>
              <MarkButton format="bold" icon="format_bold" />
              <MarkButton format="italic" icon="format_italic" />
              <MarkButton format="underline" icon="format_underlined" />
              <MarkButton format="code" icon="code" />
              <BlockButton format="heading-one" icon="looks_one" />
              <BlockButton format="heading-two" icon="looks_two" />
              <BlockButton format="block-quote" icon="format_quote" />
              <BlockButton format="numbered-list" icon="format_list_numbered" />
              <BlockButton format="bulleted-list" icon="format_list_bulleted" />
              <BlockButton format="left" icon="format_align_left" />
              <BlockButton format="center" icon="format_align_center" />
              <BlockButton format="right" icon="format_align_right" />
              <BlockButton format="justify" icon="format_align_justify" />
            </Toolbar>
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder="Enter some rich text…"
              spellCheck
              autoFocus
              onKeyDown={event => {
                for (const hotkey in HOTKEYS) {
                  if (isHotkey(hotkey, event as any)) {
                    event.preventDefault()
                    const mark = HOTKEYS[hotkey]
                    toggleMark(editor, mark)
                  }
                }
              }}
            />
          </Slate>

        </div>

        <footer className="h-20 z-5 fixed bottom-0 inset-x-0 border-solid border-t border-gray-500 bg-white">
          <div className="max-w-screen-xl mx-auto px-10 sm:px-20 h-full flex justify-between items-center">
            <div className="text-sm">
              <strong>
                <p>{post?.published ? "Published" : "Draft"}</p>
              </strong>
              <p>{savedState}</p>
            </div>
            <button
              onClick={async () => {
                await publish();
              }}
              title={
                disabled
                  ? "Post must have a title, description, and content to be published."
                  : "Publish"
              }
              disabled={disabled}
              className={`${disabled
                ? "cursor-not-allowed bg-gray-300 border-gray-300"
                : "bg-black hover:bg-white hover:text-black border-black"
                } mx-2 w-32 h-12 text-lg text-white border-2 focus:outline-none transition-all ease-in-out duration-150`}
            >
              {publishing ? <LoadingDots /> : "Publish  →"}
            </button>
          </div>
        </footer>
      </Layout>
    </>
  );
}

const toggleBlock = (editor: CustomEditor, format: string) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  )
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })
  let newProperties: Partial<SlateElement>
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    }
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
  }
  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor: CustomEditor, format: string) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor: CustomEditor, format: string, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  )

  return !!match
}

const isMarkActive = (editor: CustomEditor, format: string) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const Element = ({ attributes, children, element }: { attributes: Node, children: ReactNode, element: CustomElement }) => {
  const style = { textAlign: element.align ?? '' }
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      )
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      )
    case 'heading-one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      )
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    case 'numbered-list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      )
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }
}

const Leaf = ({ attributes, children, leaf }: { attributes: Node, children: ReactNode, leaf: CustomText }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

const BlockButton = ({ format, icon }: { format: string }) => {
  const editor = useSlate()
  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
      )}
      onMouseDown={event => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

const MarkButton = ({ format, icon }: { format: string }) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      { text: 'Почніть ' },
      { text: 'створювати', bold: true },
      { text: ' свій, ' },
      { text: 'найкращий', italic: true },
      { text: ' пост!' },
    ],
  },
]
