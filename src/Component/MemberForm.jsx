import { useId, useRef, useState } from "react";
import Avatar from "./Avatar";
import { Modal } from "./Modal";
import { GENDERS, POSITIONS } from "../constants";
import { fileToAvatar } from "../utils/image";
import "./MemberForm.css";

const emptyForm = {
  name: "",
  gender: GENDERS[0],
  position: POSITIONS[0].value,
  email: "",
  phone: "",
  startDate: "",
  photo: "",
};

function Field({ id, label, error, required, children }) {
  return (
    <div className={`field${error ? " has-error" : ""}`}>
      <label htmlFor={id}>
        {label}
        {required && <span className="req"> *</span>}
      </label>
      {children}
      {error && (
        <p className="field-error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function MemberForm({ member, members, onSubmit, onClose }) {
  const isEdit = Boolean(member);
  const uid = useId();
  const fileRef = useRef(null);

  const [form, setForm] = useState(() =>
    member
      ? {
          name: member.name,
          gender: member.gender,
          position: member.position,
          email: member.email ?? "",
          phone: member.phone ?? "",
          startDate: member.startDate ?? "",
          photo: member.photo ?? "",
        }
      : emptyForm,
  );
  const [errors, setErrors] = useState({});
  const [photoError, setPhotoError] = useState("");
  const [busy, setBusy] = useState(false);

  const update = (field, value) => {
    setForm((old) => ({ ...old, [field]: value }));
    setErrors((old) => (old[field] ? { ...old, [field]: undefined } : old));
  };

  const validate = () => {
    const result = {};
    const name = form.name.trim();

    if (!name) {
      result.name = "กรุณากรอกชื่อสมาชิก";
    } else if (name.length > 60) {
      result.name = "ชื่อต้องไม่เกิน 60 ตัวอักษร";
    } else if (
      members.some(
        (m) => m.id !== member?.id && m.name.trim().toLowerCase() === name.toLowerCase(),
      )
    ) {
      result.name = "มีชื่อนี้อยู่ในระบบแล้ว";
    }

    const email = form.email.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      result.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }

    const phone = form.phone.trim();
    if (phone) {
      const digits = phone.replace(/\D/g, "");
      if (!/^[0-9+\-\s()]+$/.test(phone) || digits.length < 9 || digits.length > 15) {
        result.phone = "เบอร์โทรไม่ถูกต้อง (ต้องมี 9-15 หลัก)";
      }
    }

    return result;
  };

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setPhotoError("");
    setBusy(true);
    try {
      update("photo", await fileToAvatar(file));
    } catch (err) {
      setPhotoError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    onSubmit({
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    });
  };

  const fid = (name) => `${uid}-${name}`;

  return (
    <Modal
      title={isEdit ? "แก้ไขสมาชิก" : "เพิ่มสมาชิกใหม่"}
      subtitle="ช่องที่มี * จำเป็นต้องกรอก"
      onClose={onClose}
      closeOnOverlay={false}
    >
      <form className="member-form" onSubmit={handleSubmit} noValidate>
        <div className="photo-field">
          <Avatar
            member={{ photo: form.photo, position: form.position, name: form.name }}
            size="xl"
          />
          <div className="photo-actions">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handlePhoto}
            />
            <div className="photo-buttons">
              <button
                type="button"
                className="upload-button"
                disabled={busy}
                onClick={() => fileRef.current?.click()}
              >
                {busy ? "กำลังประมวลผล..." : form.photo ? "เปลี่ยนรูป" : "อัปโหลดรูปโปรไฟล์"}
              </button>
              {form.photo && (
                <button
                  type="button"
                  className="remove-photo"
                  onClick={() => update("photo", "")}
                >
                  ลบรูป
                </button>
              )}
            </div>
            <small>
              ไม่บังคับ — ระบบจะครอบตัดเป็นสี่เหลี่ยมจัตุรัสและย่อขนาดให้อัตโนมัติ
            </small>
            {photoError && (
              <p className="field-error" role="alert">
                {photoError}
              </p>
            )}
          </div>
        </div>

        <Field id={fid("name")} label="ชื่อสมาชิก" required error={errors.name}>
          <input
            id={fid("name")}
            type="text"
            placeholder="กรอกชื่อสมาชิก"
            value={form.name}
            maxLength={80}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${fid("name")}-error` : undefined}
            autoFocus
          />
        </Field>

        <div className="form-row">
          <Field id={fid("gender")} label="เพศ">
            <select
              id={fid("gender")}
              value={form.gender}
              onChange={(e) => update("gender", e.target.value)}
            >
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </Field>

          <Field id={fid("position")} label="ตำแหน่ง">
            <select
              id={fid("position")}
              value={form.position}
              onChange={(e) => update("position", e.target.value)}
            >
              {POSITIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.value}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="form-row">
          <Field id={fid("email")} label="อีเมล" error={errors.email}>
            <input
              id={fid("email")}
              type="email"
              inputMode="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? `${fid("email")}-error` : undefined}
            />
          </Field>

          <Field id={fid("phone")} label="เบอร์โทร" error={errors.phone}>
            <input
              id={fid("phone")}
              type="tel"
              inputMode="tel"
              placeholder="08x-xxx-xxxx"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? `${fid("phone")}-error` : undefined}
            />
          </Field>
        </div>

        <Field id={fid("start")} label="วันที่เริ่มงาน">
          <input
            id={fid("start")}
            type="date"
            value={form.startDate}
            onChange={(e) => update("startDate", e.target.value)}
          />
        </Field>

        <div className="modal-actions">
          <button type="button" className="cancel-button" onClick={onClose}>
            ยกเลิก
          </button>
          <button type="submit" className="save-button" disabled={busy}>
            {isEdit ? "บันทึกการแก้ไข" : "เพิ่มสมาชิก"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default MemberForm;
