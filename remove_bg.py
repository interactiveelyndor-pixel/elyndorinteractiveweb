from PIL import Image
import numpy as np

def remove_black_background(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img)

    # Define what is considered "black"
    # We'll use a threshold to catch near-black compression artifacts
    threshold = 30
    
    # r, g, b are the first 3 channels
    r, g, b, a = data.T

    # Identify black pixels: (R < threshold) AND (G < threshold) AND (B < threshold)
    black_areas = (r < threshold) & (g < threshold) & (b < threshold)

    # Set alpha to 0 for those pixels
    data[..., 3][black_areas.T] = 0

    # Create new image
    new_img = Image.fromarray(data)
    new_img.save(output_path)
    print(f"Processed {input_path} and saved to {output_path}")

if __name__ == "__main__":
    remove_black_background('assets/logo.png', 'assets/logo_transparent.png')
