import os

replacements = {
    'text-[9px]': 'text-[17px]',
    'text-[10px]': 'text-[18px]',
    'text-[11px]': 'text-[19px]',
    'text-xs': 'text-[20px]',
    'text-sm': 'text-[22px]',
    'text-base': 'text-[24px]',
    'text-lg': 'text-[26px]',
    'text-xl': 'text-[28px]',
    'text-2xl': 'text-[32px]',
    'text-3xl': 'text-[38px]',
    'text-4xl': 'text-[44px]',
    'text-5xl': 'text-[56px]',
}

def process_directory(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r') as f:
                    content = f.read()
                
                # Careful with replacements so we don't accidentally replace a substring of another class
                # E.g., text-sm might match text-sm-something.
                # Adding spaces or quotes around might be safer, but Tailwind classes are usually space separated.
                import re
                new_content = content
                for old, new in replacements.items():
                    # We use regex with word boundaries or negative lookarounds to avoid partial matches
                    # e.g., (?<!-)text-sm(?!-)
                    pattern = r'(?<![-a-zA-Z0-9])' + re.escape(old) + r'(?![-a-zA-Z0-9])'
                    new_content = re.sub(pattern, new, new_content)
                
                if new_content != content:
                    with open(filepath, 'w') as f:
                        f.write(new_content)
                    print(f"Updated {filepath}")

if __name__ == "__main__":
    process_directory('/Users/sachin/Desktop/PathshalaERP/frontend/app')
