from datetime import datetime
import urllib.request
import base64
import json
import time
import os
import sys
import tempfile

webui_server_url = "http://127.0.0.1:7860"

if len(sys.argv) >= 5:
    len = len(sys.argv)
    strength = sys.argv[len - 1]
    height = sys.argv[len - 2]
    width = sys.argv[len - 3]
    out_dir = sys.argv[len - 4]
    in_file = sys.argv[len - 5]

    os.makedirs(out_dir, exist_ok=True)

    print(strength)
    print(height)
    print(width)
    print(out_dir)
    print(in_file)

    def timestamp():
        return datetime.fromtimestamp(time.time()).strftime("%Y%m%d-%H%M%S")

    def encode_file_to_base64(path):
        with open(path, "rb") as file:
            f = base64.b64encode(file.read()).decode("utf-8")
        os.remove(path)
        return f

    def decode_and_save_base64(base64_str, save_path):
        with open(save_path, "wb") as file:
            file.write(base64.b64decode(base64_str))

    def call_api(api_endpoint, **payload):
        data = json.dumps(payload).encode("utf-8")
        request = urllib.request.Request(
            f"{webui_server_url}/{api_endpoint}",
            headers={"Content-Type": "application/json"},
            data=data,
        )
        response = urllib.request.urlopen(request)
        return json.loads(response.read().decode("utf-8"))

    def call_img2img_api(**payload):
        response = call_api("sdapi/v1/img2img", **payload)
        for index, image in enumerate(response.get("images")):
            save_path = os.path.join(out_dir, f"{timestamp()}-{index}.png")
            decode_and_save_base64(image, save_path)

    if __name__ == "__main__":
        init_images = [
            encode_file_to_base64(in_file),
        ]

        payload = {
            "prompt": "1girl, blue hair",
            "negative_prompt": "(deformed, distorted, disfigured:1.3), poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, (mutated hands and fingers:1.4), disconnected limbs, mutation, mutated, ugly, disgusting, blurry, amputation",
            "sampler_name": "DPM++ 2M",
            "scheduler": "Automatic",
            "seed": -1,
            "steps": 20,
            "width": width,
            "height": height,
            "denoising_strength": strength,
            "n_iter": 1,
            "init_images": init_images,
        }

        call_img2img_api(**payload)
    
    f = tempfile.gettempdir()  + '\\SD_vbs_finalize.vbs'
    with open(f, 'w') as tmp:
        tmp.write('Option Explicit\nOn Error Resume Next\nDim appRef\nDim desc\nSet appRef = CreateObject("Photoshop.Application")\nSet desc = CreateObject("Photoshop.ActionDescriptor")\ndesc.putBoolean appRef.stringIDToTypeID("runMode"), true\nappRef.executeAction appRef.stringIDToTypeID("55a8fbbe-9b5e-4a82-8601-1921bcd61edd"), desc, 3')
        tmp.close()
    os.startfile(f)
    time.sleep(1)
    os.remove(f)
