import { MdVideoLibrary } from "@react-icons/all-files/md/MdVideoLibrary";
import { MdFormatBold } from "@react-icons/all-files/md/MdFormatBold";
import { MdFormatItalic } from "@react-icons/all-files/md/MdFormatItalic";
import { MdStrikethroughS } from "@react-icons/all-files/md/MdStrikethroughS";
import { MdFormatUnderlined } from "@react-icons/all-files/md/MdFormatUnderlined";
import { MdFormatQuote } from "@react-icons/all-files/md/MdFormatQuote";
import { MdFormatAlignLeft } from "@react-icons/all-files/md/MdFormatAlignLeft";
import { MdFormatAlignCenter } from "@react-icons/all-files/md/MdFormatAlignCenter";
import { MdFormatAlignRight } from "@react-icons/all-files/md/MdFormatAlignRight";
import { MdFormatAlignJustify } from "@react-icons/all-files/md/MdFormatAlignJustify";
import { MdFormatListNumbered } from "@react-icons/all-files/md/MdFormatListNumbered";
import { MdFormatListBulleted } from "@react-icons/all-files/md/MdFormatListBulleted";
import { MdInsertLink } from "@react-icons/all-files/md/MdInsertLink";
import { MdImage } from "@react-icons/all-files/md/MdImage";
import { MdAdd } from "@react-icons/all-files/md/MdAdd";
import { MdKeyboardArrowRight } from "@react-icons/all-files/md/MdKeyboardArrowRight";
import { MdArrowForward } from "@react-icons/all-files/md/MdArrowForward";

import { BsTypeH1 } from "@react-icons/all-files/bs/BsTypeH1"
import { BsTypeH2 } from "@react-icons/all-files/bs/BsTypeH2"
import { BsTypeH3 } from "@react-icons/all-files/bs/BsTypeH3"
import { BsCameraVideoFill } from "@react-icons/all-files/bs/BsCameraVideoFill";

import { FaSuperscript } from "@react-icons/all-files/fa/FaSuperscript";
import { FaSubscript } from "@react-icons/all-files/fa/FaSubscript";

import { AiFillEdit } from "@react-icons/all-files/ai/AiFillEdit";
import { AiOutlineTable } from "@react-icons/all-files/ai/AiOutlineTable";
import { AiOutlineInsertRowBelow } from "@react-icons/all-files/ai/AiOutlineInsertRowBelow";
import { AiOutlineInsertRowRight } from "@react-icons/all-files/ai/AiOutlineInsertRowRight";
import { AiOutlineDelete } from "@react-icons/all-files/ai/AiOutlineDelete";
import { AiFillTag } from "@react-icons/all-files/ai/AiFillTag";
import { AiOutlineUpload } from "@react-icons/all-files/ai/AiOutlineUpload";
import { HiArrowsExpand } from "@react-icons/all-files/hi/HiArrowsExpand";
import { AiOutlineInsertRowAbove } from "@react-icons/all-files/ai/AiOutlineInsertRowAbove";
import { AiOutlineInsertRowLeft } from "@react-icons/all-files/ai/AiOutlineInsertRowLeft";
import { AiFillHtml5 } from "@react-icons/all-files/ai/AiFillHtml5";
import { AiFillDelete } from "@react-icons/all-files/ai/AiFillDelete";

import { SiLatex } from "@react-icons/all-files/si/SiLatex";

import { BiCodeAlt } from "@react-icons/all-files/bi/BiCodeAlt";
import { BiCodeBlock } from "@react-icons/all-files/bi/BiCodeBlock";
import { BiParagraph } from "@react-icons/all-files/bi/BiParagraph";

import { IoLogoYoutube } from "@react-icons/all-files/io/IoLogoYoutube";

const iconList = {
  bold: <MdFormatBold size={20} />,
  italic: <MdFormatItalic size={20} />,
  strikethrough: <MdStrikethroughS size={20} />,
  underline: <MdFormatUnderlined size={20} />,
  code: <BiCodeAlt size={20} />,
  "heading-one": <BsTypeH1 size={20} />,
  "heading-two": <BsTypeH2 size={20} />,
  "heading-three": <BsTypeH3 size={20} />,
  "paragraph": <BiParagraph size={19} />,

  "block-quote": <MdFormatQuote size={20} />,
  superscript: <FaSuperscript size={15} />,
  subscript: <FaSubscript size={15} />,
  left: <MdFormatAlignLeft size={20} />,
  center: <MdFormatAlignCenter size={20} />,
  right: <MdFormatAlignRight size={20} />,
  justify: <MdFormatAlignJustify size={20} />,
  "numbered-list": <MdFormatListNumbered size={20} />,
  "bulleted-list": <MdFormatListBulleted size={20} />,
  link: <MdInsertLink size={20} />,
  image: <MdImage color="#7a7ae5" size={20} />,
  video: <MdVideoLibrary size={20} />,
  youtube: <IoLogoYoutube color={"#e73e3e"} size={19} />,
  "code-block": <BiCodeBlock size={20} />,
  add: <MdAdd size={20} />,
  table: <AiOutlineTable size={20} />,
  insertRowBelow: <AiOutlineInsertRowBelow size={25} />,
  insertColumnRight: <AiOutlineInsertRowRight size={25} />,
  insertColumnLeft: <AiOutlineInsertRowLeft size={25} />,
  insertRowAbove: <AiOutlineInsertRowAbove size={25} />,
  trashCan: <AiOutlineDelete size={25} />,
  addId: <AiFillTag size={20} />,
  upload: <AiOutlineUpload size={20} />,
  equation: <SiLatex size={20} />,
  resize: <HiArrowsExpand style={{transform:"rotate"}} size={20} />,
  videoPlayer: <BsCameraVideoFill size={20} />,
  insertHtml: <AiFillHtml5 size={20} />,
  arrowRight: <MdArrowForward size={35} />,
  pen: <AiFillEdit size={20} />,
  removeMedia: <AiFillDelete size={20} color="red" />
};

const Icon = (props) => {
  const { icon } = props;
  return iconList[icon];
};

export default Icon;
