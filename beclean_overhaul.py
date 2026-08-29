import os

replacements = {
    'bg-[#050505]': 'bg-slate-50',
    'bg-[#0A0A0A]': 'bg-white',
    'bg-[#121212]': 'bg-slate-100',
    'border-white/10': 'border-slate-200',
    'border-white/20': 'border-slate-300',
    'border-white/30': 'border-slate-300',
    'text-white': 'text-slate-800',
    'text-[#A1A1AA]': 'text-slate-500',
    'text-[#D4D4D8]': 'text-slate-600',
    'text-zinc-400': 'text-slate-500',
    'text-zinc-300': 'text-slate-600',
    'bg-white text-black': 'bg-sky-500 text-white',
    'hover:bg-gray-200': 'hover:bg-sky-600',
    'bg-white/5': 'bg-sky-50',
    'hover:bg-white/10': 'hover:bg-slate-100',
    'shadow-white/10': 'shadow-sky-500/20',
    'shadow-white/5': 'shadow-sky-500/10',
    'shadow-white/20': 'shadow-sky-500/30',
    'focus:border-white/50': 'focus:border-sky-500',
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
