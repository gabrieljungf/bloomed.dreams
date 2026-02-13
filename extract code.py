import os

# --- CONFIGURAÇÃO ---
ROOT_DIR = '.'
OUTPUT_FILE = 'project_context.txt'
FOLDERS_TO_IGNORE = {'node_modules', '.git', '.next', '.vscode', '__pycache__', 'out', 'build'}
FILES_TO_IGNORE = {'package-lock.json', '.env.local', OUTPUT_FILE}
EXTENSIONS_TO_IGNORE = {
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
    '.woff', '.woff2', '.ttf', '.eot', '.mp4', '.webm', '.lock'
}
# --- FIM DA CONFIGURAÇÃO ---

def extract_code():
    print("Iniciando a extração do código...")
    with open(OUTPUT_FILE, 'w', encoding='utf-8', errors='ignore') as outfile:
        for root, dirs, files in os.walk(ROOT_DIR, topdown=True):
            # Remove as pastas ignoradas da lista de diretórios a serem percorridos
            dirs[:] = [d for d in dirs if d not in FOLDERS_TO_IGNORE]
            
            for filename in files:
                if filename in FILES_TO_IGNORE:
                    continue
                
                if os.path.splitext(filename)[1].lower() in EXTENSIONS_TO_IGNORE:
                    continue

                filepath = os.path.join(root, filename)
                
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as infile:
                        content = infile.read()
                        
                        outfile.write(f"\n# =================================================================\n")
                        outfile.write(f"# Arquivo: {filepath}\n")
                        outfile.write(f"# =================================================================\n\n")
                        outfile.write(content)
                        outfile.write("\n")
                except Exception as e:
                    print(f"Erro ao ler o arquivo {filepath}: {e}")

    print(f"Processo concluído! Todo o código foi salvo em \"{OUTPUT_FILE}\".")

if __name__ == '__main__':
    extract_code()