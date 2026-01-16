# Media Handling Rules

When working with images in this project, follow these rules to ensure maximum compatibility and performance:

1.  **Browser Compatibility**: Always use web-compatible formats (JPEG, PNG, WebP) for images intended to be displayed in the gallery or on the website.
2.  **Automatic HEIC Conversion**: If you encounter `.heic` or `.heif` files, you **MUST** automatically convert them to `.jpeg` using the system tools (`sips` on macOS) before adding them to the codebase.
    - **Command**: `sips -s format jpeg [filename].heic --out [filename].jpeg`
    - **Cleanup**: Delete the original `.heic` file after successful conversion.
3.  **Naming Convention**: Follow the `hana-XX.[ext]` naming convention for journey photos to maintain chronological order.
