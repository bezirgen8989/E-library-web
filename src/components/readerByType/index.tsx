type Props = {
  fileType: "pdf" | "html" | "txt" | "null";
  content: string;
};

export const ReaderByType = ({ fileType, content }: Props) => {
  const sanitizeHtml = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const imgs = doc.querySelectorAll("img");
    imgs.forEach((img) => img.remove());

    let meta = doc.querySelector("meta[name='viewport']") as HTMLMetaElement;
    if (!meta) {
      meta = doc.createElement("meta") as HTMLMetaElement;
      meta.name = "viewport";
      meta.content =
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
      doc.head.appendChild(meta);
    }

    return doc.body.innerHTML;
  };

  const renderPdf = () => {
    const pdfUrl = `data:application/pdf;base64,${content}#toolbar=0`;
    return (
      <iframe
        src={pdfUrl}
        width="100%"
        height="1000px"
        title="PDF Viewer"
        style={{ display: "block", border: "none" }}
      />
    );
  };

  const reader = {
    html: <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />,
    pdf: renderPdf(),
    txt: (
      <div
        style={{
          whiteSpace: "pre-wrap",
          padding: "16px",
          fontFamily: "monospace",
        }}
      >
        {content}
      </div>
    ),
    null: <div>{content}</div>,
  };

  return <div>{reader[fileType]}</div>;
};
