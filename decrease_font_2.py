import os
import re

replacements = {
    'text-[15px]': 'text-[13px]',
    'text-[16px]': 'text-[14px]',
    'text-[17px]': 'text-[15px]',
    'text-[18px]': 'text-[16px]',
    'text-[20px]': 'text-[18px]',
    'text-[22px]': 'text-[20px]',
    'text-[24px]': 'text-[22px]',
    'text-[26px]': 'text-[24px]',
    'text-[30px]': 'text-[28px]',
    'text-[36px]': 'text-[34px]',
    'text-[42px]': 'text-[40px]',
    'text-[54px]': 'text-[52px]',
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
                    pattern = r'(?<![-a-zA-Z0-9])' + re.escape(old) + r'(?![-a-zA-Z0-9])'
                    new_content = re.sub(pattern, new, new_content)
                
                if new_content != content:
                    with open(filepath, 'w') as f:
                        f.write(new_content)
                    print(f"Updated {filepath}")

if __name__ == "__main__":
    process_directory('/Users/sachin/Desktop/PathshalaERP/frontend/app')
