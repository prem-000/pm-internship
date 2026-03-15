import os
from sentence_transformers import SentenceTransformer
import torch

class ModelLoader:
    _instance = None
    _model = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelLoader, cls).__new__(cls)
        return cls._instance

    @property
    def model(self):
        """Lazy load the transformer model when first accessed."""
        if self._model is None:
            print("⏳ Initializing Transformer Model (Lazy Loading)...")
            # We use a lightweight model suitable for 512MB RAM
            # 'all-MiniLM-L6-v2' is ~80MB and very efficient
            model_name = "all-MiniLM-L6-v2"
            
            # Use CPU for deployment on Render free tier
            device = "cpu"
            
            self._model = SentenceTransformer(model_name, device=device)
            print(f"✅ Transformer Model '{model_name}' loaded successfully on {device}.")
        return self._model

    def get_embeddings(self, texts):
        """Generate embeddings for a list of texts."""
        return self.model.encode(texts, convert_to_tensor=True)

# Global model loader instance
model_loader = ModelLoader()
