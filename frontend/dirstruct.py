import seedir as sd

# Define the folders you want to ignore
ignore = ['.git', '__pycache__', 'node_modules', 'env']

# Print the tree
sd.seedir(
    path='.', 
    style='lines', 
    exclude_folders=ignore,
    itemlimit=10 # Optional: limits number of files per folder to keep it short
)