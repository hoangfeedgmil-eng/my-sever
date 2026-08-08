let activeKey = null;

// Xác thực key
document.getElementById('verifyBtn').addEventListener('click', async () => {
  const key = document.getElementById('keyInput').value.trim();
  if (!key) {
    document.getElementById('status').innerHTML = '⚠️ Nhập key đi ku';
    document.getElementById('status').style.color = '#ff0';
    return;
  }

  try {
    const res = await fetch('/verify-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key })
    });
    if (!res.ok) throw new Error('Lỗi kết nối server');
    const data = await res.json();
    const status = document.getElementById('status');
    if (data.valid) {
      activeKey = key;
      status.innerHTML = `✅ Key hợp lệ - hết hạn: ${new Date(data.expiry).toLocaleString()}`;
      status.style.color = '#0f0';
    } else {
      activeKey = null;
      status.innerHTML = `❌ ${data.error}`;
      status.style.color = '#f00';
    }
  } catch (err) {
    document.getElementById('status').innerHTML = `⚠️ Lỗi: ${err.message}`;
    document.getElementById('status').style.color = '#f80';
  }
});

// Chọn tất cả
document.getElementById('selectAllBtn').addEventListener('click', () => {
  document.querySelectorAll('.feature').forEach(cb => cb.checked = true);
});

// Áp dụng
document.getElementById('applyBtn').addEventListener('click', () => {
  if (!activeKey) {
    document.getElementById('result').innerHTML = '<p style="color:#f00;">❌ Mày chưa kích hoạt key!</p>';
    return;
  }
  const selected = [];
  document.querySelectorAll('.feature:checked').forEach(cb => selected.push(cb.value));
  if (selected.length === 0) {
    document.getElementById('result').innerHTML = '<p style="color:#ff0;">⚠️ Chọn ít nhất 1 chức năng</p>';
    return;
  }
  document.getElementById('result').innerHTML = `
    <p style="color:#0ff;">🔥 Đang áp dụng cho key: <strong>${activeKey}</strong></p>
    <p style="color:#0ff;">⚡ Chức năng: <strong>${selected.join(', ')}</strong></p>
    <p style="color: #ff0; font-size:20px;">💀 DEVILS WILL RISE - Thành công!</p>
  `;
});

// Tạo key (form gen key)
document.getElementById('genKeyBtn').addEventListener('click', async () => {
  const duration = document.getElementById('durationSelect').value;
  try {
    const res = await fetch('/generate-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ duration })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Lỗi tạo key');
    }
    const data = await res.json();
    document.getElementById('newKeyDisplay').innerHTML = `
      ✅ Key mới: <strong style="color:#0ff;">${data.key}</strong> (hết hạn: ${new Date(data.expiry).toLocaleString()})
    `;
    // Tự động điền vào ô nhập key luôn cho tiện
    document.getElementById('keyInput').value = data.key;
  } catch (err) {
    document.getElementById('newKeyDisplay').innerHTML = `❌ Lỗi: ${err.message}`;
    document.getElementById('newKeyDisplay').style.color = '#f00';
  }
});