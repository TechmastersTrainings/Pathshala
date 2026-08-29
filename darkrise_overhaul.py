import os

replacements = {
    'bg-[var(--bg-primary)]': 'bg-[#050505]',
    'bg-white': 'bg-[#0A0A0A]',
    'bg-gray-50': 'bg-[#121212]',
    'border-gray-200': 'border-white/10',
    'text-gray-800': 'text-white',
    'text-gray-900': 'text-white',
    'text-gray-500': 'text-[#A1A1AA]',
    'text-gray-600': 'text-[#A1A1AA]',
    'bg-[var(--primary)] text-white': 'bg-white text-black',
    'bg-[var(--primary)]': 'bg-white text-black',
    'hover:bg-[var(--primary-hover)]': 'hover:bg-gray-200',
    'border-[var(--primary)]': 'border-white/20',
    'text-[var(--secondary)]': 'text-[#D4D4D8]',
    'bg-[var(--secondary)]/10': 'bg-white/5',
    'hover:bg-gray-100': 'hover:bg-white/10',
    'border-[var(--primary)]/30': 'border-white/30',
    'shadow-[var(--primary)]/15': 'shadow-white/10',
    'shadow-[var(--primary)]/10': 'shadow-white/5',
    'shadow-[var(--primary)]/20': 'shadow-white/20',
    'text-[var(--primary)]': 'text-white',
    'focus:border-[var(--primary)]': 'focus:border-white/50',
    'bg-gray-100': 'bg-[#121212]',
}

def process_directory(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r') as f:
                    content = f.read()
                
                new_content = content
                for old, new in replacements.items():
                    new_content = new_content.replace(old, new)
                
                if new_content != content:
                    with open(filepath, 'w') as f:
                        f.write(new_content)
                    print(f"Updated {filepath}")

if __name__ == "__main__":
    process_directory('/Users/sachin/Desktop/PathshalaERP/frontend/app')
