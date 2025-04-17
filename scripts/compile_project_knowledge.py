import os

# List of files to include in the knowledge compilation
files_to_compile = [
    "pages/api/interpret-dream.ts",
    "app/page.tsx",
    "app/(dashboard)/dashboard/decoder/page.tsx",
    "lib/services/dream-service.ts",
    "lib/services/profile-service.ts",
    "lib/types/database.types.ts",
    "types/dreams.ts",
    "lib/config/constants.ts",
    "lib/utils.ts",
    "components/chat/voiceflow-chat.tsx",
    "app/(dashboard)/dashboard/journal/page.tsx",
    "components/journal/dream-journal.tsx",
    "components/journal/dream-card.tsx",
    "components/journal/dream-grid.tsx",
    "components/journal/tag-selector.tsx"
]

def compile_files(base_path: str, output_file: str):
    with open(output_file, "w", encoding="utf-8") as outfile:
        for file_path in files_to_compile:
            full_path = os.path.join(base_path, file_path)
            if os.path.exists(full_path):
                with open(full_path, "r", encoding="utf-8") as infile:
                    content = infile.read()
                outfile.write(f"// ===== File: {file_path} =====\\n")
                outfile.write(content)
                outfile.write("\\n\\n")
            else:
                outfile.write(f"// ===== File: {file_path} NOT FOUND =====\\n\\n")

if __name__ == "__main__":
    # Adjust base_path if running from a different directory
    base_path = os.path.dirname(os.path.abspath(__file__)) + "/../"
    output_file = os.path.join(base_path, "compiled_project_knowledge.txt")
    compile_files(base_path, output_file)
    print(f"Compiled knowledge written to {output_file}")
