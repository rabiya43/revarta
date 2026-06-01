import mammoth from "mammoth";

export const maxDuration = 30;

const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!file || typeof file === "string") {
    return Response.json({ error: "No file uploaded." }, { status: 400 });
  }

  const blob = file as Blob;
  const buf = Buffer.from(await blob.arrayBuffer());
  if (buf.length > MAX_BYTES) {
    return Response.json({ error: "File too large (max 5 MB)." }, { status: 400 });
  }

  const name = "name" in file && typeof file.name === "string" ? file.name.toLowerCase() : "";
  const type = blob.type;

  let text = "";
  try {
    if (type === "text/plain" || name.endsWith(".txt") || name.endsWith(".md")) {
      text = buf.toString("utf-8");
    } else if (type === "application/pdf" || name.endsWith(".pdf")) {
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: buf });
      try {
        const data = await parser.getText();
        text = data.text ?? "";
      } finally {
        await parser.destroy();
      }
    } else if (
      type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      name.endsWith(".docx")
    ) {
      const result = await mammoth.extractRawText({ buffer: buf });
      text = result.value;
    } else {
      return Response.json(
        { error: "Use a PDF, Word (.docx), or text file — or paste your content." },
        { status: 400 }
      );
    }
  } catch {
    return Response.json(
      { error: "Could not read this file. Paste the text instead." },
      { status: 422 }
    );
  }

  text = text.replace(/\s+/g, " ").trim();
  if (text.length < 20) {
    return Response.json(
      {
        error:
          "Not enough readable text (scanned PDFs often fail). Copy and paste your resume instead.",
      },
      { status: 422 }
    );
  }

  return Response.json({ text: text.slice(0, 8000) });
}
