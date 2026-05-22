$files = Get-ChildItem -Path "d:\project\vidyavaidya\src" -Recurse -Filter "*.css"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw

    $updated = $content

    # Fix @import lines referencing Playfair or DM Sans
    $updated = $updated -replace "@import url\('https://fonts\.googleapis\.com/css2\?family=Playfair[^']+'\);", "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');"
    $updated = $updated -replace "@import url\('https://fonts\.googleapis\.com/css2\?[^']*DM\+Sans[^']*'\);", "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');"

    # Replace DM Sans font-family
    $updated = $updated -replace "'DM Sans',\s*sans-serif", "'Inter', sans-serif"
    $updated = $updated -replace '"DM Sans",\s*sans-serif', '"Inter", sans-serif'
    $updated = $updated -replace "'DM Sans'", "'Inter'"
    $updated = $updated -replace '"DM Sans"', '"Inter"'

    # Replace Poppins/Inter combos
    $updated = $updated -replace "'Poppins',\s*'Inter',\s*system-ui,\s*sans-serif", "'Inter', system-ui, sans-serif"
    $updated = $updated -replace "'Poppins',\s*'Inter',\s*sans-serif", "'Inter', sans-serif"

    # Catch any remaining Poppins
    $updated = $updated -replace "'Poppins',\s*sans-serif", "'Inter', sans-serif"
    $updated = $updated -replace '"Poppins",\s*sans-serif', '"Inter", sans-serif'

    if ($updated -ne $content) {
        Set-Content $file.FullName $updated -NoNewline
        Write-Host "Fixed: $($file.FullName)"
    }
}

Write-Host "Done."
