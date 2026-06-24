import os
import sys

# Pastikan modul backend (main, rag, model, dll.) bisa di-import oleh test
# di folder tests/ baik saat pytest dijalankan dari root repo maupun backend/.
sys.path.insert(0, os.path.dirname(__file__))
