import { HTMLPreview } from "types";

const Preview: React.FC<{
  htmlPreview: HTMLPreview;
}> = (props) => {
  const targetWidth = 240;
  const targetHeight = 120;
  const scaleFactor = Math.min(
    targetWidth / props.htmlPreview.size.width,
    targetHeight / props.htmlPreview.size.height,
  );

  return (
    <div className="flex flex-col w-full">
      <div className="flex gap-2 justify-center items-center h-screen">
        <div
          className="relative flex flex-col items-center"
          style={{
            width: '100%',
            resize: "both",
            overflow: "auto",
            minWidth: "100px",
            // minHeight: "200px",
            height: 'auto'
          }}
        >
          <div
            className="flex flex-col justify-center items-center  rounded-md shadow-sm w-full h-full"
            style={{
              clipPath: "inset(0px round 6px)",
            }}
          >
            <div
              style={{
                zoom: scaleFactor,
                width: "fit",
                height: "100%",
              }}
              dangerouslySetInnerHTML={{
                __html: props.htmlPreview.content,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Preview;
