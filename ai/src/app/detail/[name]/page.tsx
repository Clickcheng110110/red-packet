"use client";
import { formatAddress } from "@/utils";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { mockWords } from "@/data/mock";
import React from "react";

function Index({ params }: { params: { name: string } }) {
  // const [editorState, setEditorState] = React.useState(() =>
  //   EditorState.createEmpty()
  // );

  // const editor = React.useRef<any>(null);
  // function focusEditor() {
  //   editor.current.focus();
  // }
  const findProject = mockWords.find(
    (item) => item.title?.toLowerCase() === params?.name?.toLowerCase()
  );
  const markdown = findProject?.markdown;
  return (
    <main className="markdown flex min-h-screen flex-col gap-6 p-24">
      <nav aria-label="breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5">
          <li className="inline-flex items-center gap-1.5">
            <a className="transition-colors hover:text-foreground" href="/">
              Home
            </a>
          </li>
          <li
            role="presentation"
            aria-hidden="true"
            className="[&amp;>svg]:size-3.5"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            </svg>
          </li>
          <li className="inline-flex items-center gap-1.5">
            <span
              role="link"
              aria-disabled="true"
              aria-current="page"
              className="font-normal text-[#fff]"
            >
              {params?.name || "--"}
            </span>
          </li>
        </ol>
      </nav>
      {/* <p className="text-[#E6E6E6] text-[32px] font-[600] leading-[44px]">
        How does the new $825M insurance offering for crypto custody by Marsh
        affect the market?
      </p> */}
      <div className="flex gap-3 leading-none">
        <img
          alt=""
          loading="lazy"
          width="21"
          height="21"
          decoding="async"
          data-nimg="1"
          src="/graph.svg"
          // style="color: transparent;"
        />
        <p className="text-[#E6E6E6] text-[18px] font-[500] leading-[44px]">
          Knowledge Graph
        </p>
      </div>
      <ul
        dangerouslySetInnerHTML={{
          __html: markdown || "--",
        }}
      ></ul>

      <div className="flex flex-col gap-2 border border-[#9196a0]/50 rounded-xl p-4 ">
        <div className="flex justify-between  ">
          <div className="flex gap-2">
            <p>
              {formatAddress("0x7A45a8D02BaBCAec9578Dd40D2E179c06676E643")}:
            </p>
            <p>This answer is very good </p>
          </div>

          <div className="flex gap-3">
            <div className="flex gap-1 items-center">
              <img className="h-4 w-4" src="/like.svg" />
              <span>1</span>
            </div>
            <div className="flex gap-1 items-center">
              <img className="h-4 w-4" src="/dislike.svg" />
              <span>0</span>
            </div>
          </div>
        </div>
        <div className="border-[#9196a0]/50 border mt-4 rounded-xl p-4 ">
          <div className="flex justify-between ml-2 mr-6 ">
            <div className="flex gap-2">
              <p>{formatAddress("0x31D02BaBCAec9578Dd40D2E179c06667763")}:</p>
              <p>I like your answer </p>
            </div>

            <div className="flex gap-3">
              <div className="flex gap-1 items-center">
                <img className="h-4 w-4" src="/like.svg" />
                <span>1</span>
              </div>
              <div className="flex gap-1 items-center">
                <img className="h-4 w-4" src="/dislike.svg" />
                <span>0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 ">
        <div className="flex justify-between border border-[#9196a0]/50 rounded-xl p-4 gap-1 ">
          <div className="flex gap-2">
            <p>{formatAddress("0x42a8D02BaBCAec9578Dd40D2E179c06634143")}:</p>
            <p>This answer is very bad </p>
          </div>

          <div className="flex gap-3">
            <div className="flex gap-1 items-center">
              <img className="h-4 w-4" src="/like.svg" />
              <span>0</span>
            </div>
            <div className="flex gap-1 items-center">
              <img className="h-4 w-4" src="/dislike.svg" />
              <span>22</span>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          border: "1px solid black",
          background: "rgba(255,255,255,1)",
          minHeight: "16em",
          cursor: "text",
        }}
        // onClick={focusEditor}
      >
        <Editor
          // editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          // onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    </main>
  );
}

export default Index;
