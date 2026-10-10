document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('delete-product-modal');
  const modalTitle = document.getElementById('delete-modal-title');
  const productName = document.getElementById('delete-product-name');
  const modalWarning = document.getElementById('delete-modal-warning');

  const closeBtn = document.getElementById('close-delete-modal');
  const cancelBtn = document.getElementById('cancel-delete');
  const confirmBtn = document.getElementById('confirm-delete');

  let currentDeleteId = null;
  let currentDeleteType = 'soft'; // 'soft' (Xóa mềm) hoặc 'force' (Xóa vĩnh viễn)

  // =========================
  // HÀM ĐÓNG MODAL
  // =========================
  function closeModal() {
    if (modal) modal.classList.add('hidden');
    currentDeleteId = null;
    currentDeleteType = 'soft';
  }

  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);

  // =========================
  // HÀM MỞ MODAL XÓA
  // =========================
  function openDeleteModal(id, name, type = 'soft') {
    currentDeleteId = id;
    currentDeleteType = type;

    if (productName) productName.textContent = name;

    if (type === 'force') {
      if (modalTitle) modalTitle.textContent = 'Xóa vĩnh viễn sản phẩm';
      if (modalWarning) {
        modalWarning.textContent = 'Hành động này không thể hoàn tác!';
        modalWarning.className = 'mt-2 text-sm font-semibold text-red-500';
      }
    } else {
      if (modalTitle) modalTitle.textContent = 'Xác nhận xóa sản phẩm';
      if (modalWarning) {
        modalWarning.textContent = 'Sản phẩm sẽ được chuyển vào thùng rác.';
        modalWarning.className = 'mt-2 text-sm text-amber-500';
      }
    }

    if (modal) modal.classList.remove('hidden');
  }

  // =========================
  // XỬ LÝ CLICK NÚT "XÓA" TRONG MODAL
  // =========================
  confirmBtn?.addEventListener('click', async () => {
    if (!currentDeleteId) return;

    // Xác định endpoint API
    const endpoint =
      currentDeleteType === 'force'
        ? `/products/${currentDeleteId}/force`
        : `/products/${currentDeleteId}`;

    try {
      confirmBtn.disabled = true;
      confirmBtn.textContent = 'Đang xử lý...';

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        window.location.reload();
      } else {
        alert(result.message || 'Thao tác thất bại');
      }
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi xóa sản phẩm');
    } finally {
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Xóa sản phẩm';
      closeModal();
    }
  });

  // =========================
  // KHÔI PHỤC SẢN PHẨM (Restore)
  // =========================
  async function handleRestore(id, name) {
    if (!id) return;
    if (!confirm(`Bạn có chắc chắn muốn khôi phục sản phẩm "${name}"?`)) return;

    try {
      const response = await fetch(`/products/${id}/restore`, {
        method: 'PATCH',
      });
      const result = await response.json();

      if (response.ok && result.success) {
        window.location.reload();
      } else {
        alert(result.message || 'Khôi phục thất bại');
      }
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi khôi phục sản phẩm');
    }
  }

  // =========================
  // GLOBAL EVENT DELEGATION
  // =========================
  document.addEventListener('click', (event) => {
    // 1. Nút Xóa mềm (.delete-product-btn)
    const deleteBtn = event.target.closest('.delete-product-btn');
    if (deleteBtn) {
      event.preventDefault();
      const id = deleteBtn.dataset.id;
      const name = deleteBtn.dataset.name || 'sản phẩm';
      openDeleteModal(id, name, 'soft');
      return;
    }

    // 2. Nút Xóa vĩnh viễn (.force-delete-product-btn)
    const forceDeleteBtn = event.target.closest('.force-delete-product-btn');
    if (forceDeleteBtn) {
      event.preventDefault();
      const id = forceDeleteBtn.dataset.id;
      const name = forceDeleteBtn.dataset.name || 'sản phẩm';
      openDeleteModal(id, name, 'force');
      return;
    }

    // 3. Nút Khôi phục (.restore-product-btn)
    const restoreBtn = event.target.closest('.restore-product-btn');
    if (restoreBtn) {
      const id = restoreBtn.dataset.id;
      const name = restoreBtn.dataset.name || 'sản phẩm';
      handleRestore(id, name);
      return;
    }
  });
});
