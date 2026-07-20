import re

with open('src/theme/knotice-theme.css', 'r') as f:
    content = f.read()

# Extract the two blocks
dark_pattern = r'\.dark \.radix-themes\[data-accent-color="red"\].*?\}[\n\s]*@supports.*?\}[\n\s]*\}'
light_pattern = r':root \.radix-themes\[data-accent-color="red"\].*?\}[\n\s]*@supports.*?\}[\n\s]*\}'

dark_match = re.search(dark_pattern, content, re.DOTALL)
light_match = re.search(light_pattern, content, re.DOTALL)

if dark_match and light_match:
    dark_text = dark_match.group(0)
    light_text = light_match.group(0)
    
    # Remove both from content
    content = content.replace(dark_text, '')
    content = content.replace(light_text, '')
    
    # Add them back in the correct order: Light first, then Dark
    # And change the light selector to just target .radix-themes (base) or .light-theme
    light_text = light_text.replace(':root .radix-themes[data-accent-color="red"], .light .radix-themes[data-accent-color="red"], .radix-themes.light-theme[data-accent-color="red"]', '.radix-themes[data-accent-color="red"]')
    
    # And for the @supports block
    light_text = light_text.replace(':root .radix-themes[data-accent-color="red"], .light .radix-themes[data-accent-color="red"], .radix-themes.light-theme[data-accent-color="red"]', '.radix-themes[data-accent-color="red"]')
    
    # Dark text is fine, just make it target .dark .radix-themes, .radix-themes.dark-theme
    
    new_content = content.strip() + "\n\n/* Custom Radix Red Palette Overrides */\n\n" + light_text + "\n\n" + dark_text + "\n"
    
    with open('src/theme/knotice-theme.css', 'w') as f:
        f.write(new_content)
    print("Fixed CSS order and specificity!")
else:
    print("Could not find blocks")
