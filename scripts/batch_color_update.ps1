# Batch color replacement script for Luxury Wellness palette
# Replaces all purple/indigo/violet/lavender with Gold/Champagne/Smoke/Taupe

$files = @(
    "c:\LuminelCoach\components\ProgressPage.tsx",
    "c:\LuminelCoach\components\SettingsPage.tsx",
    "c:\LuminelCoach\components\WelcomePage.tsx",
    "c:\LuminelCoach\components\ExperiencesPage.tsx",
    "c:\LuminelCoach\components\ChatPage.tsx",
    "c:\LuminelCoach\components\CommunityPage.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Primary color replacements
        $content = $content -replace 'indigo-600', 'luminel-gold-soft'
        $content = $content -replace 'indigo-700', 'luminel-taupe'
        $content = $content -replace 'indigo-500', 'luminel-gold-soft'
        $content = $content -replace 'indigo-400', 'luminel-gold-soft'
        $content = $content -replace 'indigo-300', 'luminel-champagne'
        $content = $content -replace 'indigo-200', 'luminel-champagne'
        $content = $content -replace 'indigo-100', 'luminel-champagne'
        $content = $content -replace 'indigo-50', 'luminel-champagne'
        
        $content = $content -replace 'purple-600', 'luminel-gold-soft'
        $content = $content -replace 'purple-700', 'luminel-taupe'
        $content = $content -replace 'purple-500', 'luminel-gold-soft'
        $content = $content -replace 'purple-400', 'luminel-gold-soft'
        $content = $content -replace 'purple-300', 'luminel-champagne'
        $content = $content -replace '(purple-200|purple-100)', 'luminel-champagne'
        $content = $content -replace 'purple-50', 'luminel-champagne'
        $content = $content -replace 'purple-900', 'luminel-smoke'
        
        $content = $content -replace 'lavender-600', 'luminel-gold-soft'
        $content = $content -replace 'lavender-500', 'luminel-gold-soft'
        $content = $content -replace 'lavender-400', 'luminel-gold-soft'
        $content = $content -replace 'lavender-100', 'luminel-champagne'
        $content = $content -replace 'lavender-50', 'luminel-champagne'
        
        $content = $content -replace 'violet-600', 'luminel-gold-soft'
        $content = $content -replace 'violet-500', 'luminel-gold-soft'
        
        # Pink gradients (used with purple)
        $content = $content -replace 'pink-500', 'luminel-gold-soft'
        $content = $content -replace 'pink-400', 'luminel-gold-soft'
        $content = $content -replace 'pink-50', 'luminel-champagne'
        
        Set-Content $file -Value $content -NoNewline
        Write-Host "Updated: $file"
    }
}

Write-Host "`nColor replacement complete!"
