---
description: Convert HEIC images to JPEG for web compatibility
---
# Workflow: Convert HEIC to JPEG

Use this workflow whenever you encounter HEIC images in the project.

1.  Identify HEIC files in the directory.
2.  Run the conversion command:
    // turbo
    `sips -s format jpeg *.heic --out .`
3.  Rename if necessary to follow project conventions.
4.  Remove original HEIC files:
    // turbo
    `rm *.heic`
5.  Update any HTML/CSS references to point to the new JPEG files.
