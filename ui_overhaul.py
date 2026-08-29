import os

replacements = {
    'bg-[#070B14]': 'bg-[var(--bg-primary)]',
    'bg-[#090A12]': 'bg-white',
    'bg-[#141724]': 'bg-white',
    'bg-[#0F172A]': 'bg-white',
    'border-[#262B44]': 'border-gray-200',
    'border-white/[0.08]': 'border-gray-200',
    'text-white': 'text-gray-800',
    'text-gray-400': 'text-gray-500',
    'text-gray-300': 'text-gray-600',
    'text-[#64748B]': 'text-gray-500',
    'text-[#94A3B8]': 'text-gray-600',
    'text-[#F8FAFC]': 'text-gray-900',
    'bg-[#4753A4]': 'bg-[var(--primary)] text-white',
    'hover:bg-[#3D67A4]': 'hover:bg-[var(--primary-hover)]',
    'border-[#3D67A4]': 'border-[var(--primary)]',
    'text-[#A4917B]': 'text-[var(--secondary)]',
    'bg-[#A4917B]/10': 'bg-[var(--secondary)]/10',
    'bg-white/[0.02]': 'bg-gray-50',
    'hover:bg-white/[0.05]': 'hover:bg-gray-100',
    'bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6]': 'bg-[var(--primary)]',
    'border-[#A855F7]/30': 'border-[var(--primary)]/30',
    'shadow-[#7C3AED]/15': 'shadow-[var(--primary)]/15',
    'shadow-[#7C3AED]/10': 'shadow-[var(--primary)]/10',
    'shadow-[#7C3AED]/20': 'shadow-[var(--primary)]/20',
    'text-[#A855F7]': 'text-[var(--primary)]',
    'focus:border-[#7C3AED]': 'focus:border-[var(--primary)]',
    'focus:border-[#4753A4]': 'focus:border-[var(--primary)]',
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
