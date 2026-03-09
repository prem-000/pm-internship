import docx
from pdfminer.high_level import extract_text
import io
import os

class TextExtractor:
    @staticmethod
    def extract_from_pdf(file_content: bytes) -> str:
        """Extract text from PDF file content."""
        try:
            with io.BytesIO(file_content) as pdf_file:
                text = extract_text(pdf_file)
                return text.strip()
        except Exception as e:
            print(f"Error extracting text from PDF: {e}")
            return ""

    @staticmethod
    def extract_from_docx(file_content: bytes) -> str:
        """Extract text from DOCX file content."""
        try:
            with io.BytesIO(file_content) as docx_file:
                doc = docx.Document(docx_file)
                full_text = []
                for para in doc.paragraphs:
                    full_text.append(para.text)
                return "\n".join(full_text).strip()
        except Exception as e:
            print(f"Error extracting text from DOCX: {e}")
            return ""

    @classmethod
    def extract(cls, file_content: bytes, filename: str) -> str:
        """Extract text based on file extension."""
        extension = os.path.splitext(filename)[1].lower()
        if extension == '.pdf':
            return cls.extract_from_pdf(file_content)
        elif extension == '.docx':
            return cls.extract_from_docx(file_content)
        else:
            raise ValueError(f"Unsupported file format: {extension}")
