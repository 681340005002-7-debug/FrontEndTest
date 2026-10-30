const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// ตัดรูปเป็นสี่เหลี่ยมจัตุรัสตรงกลาง ย่อเหลือ size px แล้วแปลงเป็น JPEG (data URL)
// เพื่อให้เก็บใน localStorage ได้โดยไม่เต็มเร็ว
export function fileToAvatar(file, size = 256) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("กรุณาเลือกไฟล์รูปภาพเท่านั้น"));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error("ไฟล์ใหญ่เกิน 5 MB กรุณาเลือกรูปที่เล็กกว่านี้"));
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const side = Math.min(img.width, img.height);
      const sx = (img.width - side) / 2;
      const sy = (img.height - side) / 2;

      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);

      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("ไม่สามารถอ่านรูปภาพนี้ได้"));
    };

    img.src = url;
  });
}
