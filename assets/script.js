document.addEventListener('DOMContentLoaded', () => {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxmNBYKJNNRE_lJnLRLFS4_qeBa1n-wLm1yGRbbawv76iuWvy_R90b1bmo1VcwZ6lYkCg/exec';
  
    let totalUploads = 0;
    let driveUsage = 0;
  
    document.getElementById('uploadForm').addEventListener('submit', async function (event) {
      event.preventDefault();
      const fileInput = document.getElementById('fileInput');
  
      if (!fileInput.files.length) {
        Swal.fire({
          icon: 'error',
          title: 'Waduh...😱',
          text: 'Pilih file sebelum mengupload!',
        });
        return;
      }
  
      const loadingSwal = Swal.fire({
        title: 'Sedang Proses Upload...😉',
        text: 'Harap tunggu sebentar ya.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(); 
        },
      });
  
      let uploadedFilesCount = 0;
  
      for (let i = 0; i < fileInput.files.length; i++) {
        const file = fileInput.files[i];
        const reader = new FileReader();
  
        reader.onload = async function () {
          const base64Data = reader.result.split(',')[1];
          const mimeType = file.type;
          const fileName = file.name;
  
          const formData = new URLSearchParams();
          formData.append('file', base64Data);
          formData.append('mimeType', mimeType);
          formData.append('fileName', fileName);
  
          try {
            const response = await fetch(scriptURL, {
              method: 'POST',
              body: formData,
            });
  
            const result = await response.json();
  
            if (result.success) {
              totalUploads++;
              driveUsage += Math.round(file.size / 1024 / 1024); 
  
        
              const driveUsageElement = document.getElementById('driveUsage');
              if (driveUsageElement) {
                driveUsageElement.textContent = `${driveUsage} MB`;
              }
  
              document.getElementById('totalUploads').textContent = totalUploads;
  
              const historyTable = document.getElementById('uploadHistory');
              const newRow = document.createElement('tr');
              newRow.innerHTML = `
                <td>${totalUploads}</td>
                <td>${file.name}</td>
                <td>${new Date().toLocaleString()}</td>
              `;
              historyTable.appendChild(newRow);
  
        
              const galleryGrid = document.getElementById('galleryGrid');
              const img = document.createElement('img');
              img.src = result.fileUrl;  
              img.alt = file.name;
              galleryGrid.appendChild(img);
              
            } else {
              throw new Error(result.message || 'Gagal upload');
            }
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Gagal!',
              text: `Terjadi kesalahan: ${error.message}`,
            });
          } finally {
            
            uploadedFilesCount++;
  
            
            if (uploadedFilesCount === fileInput.files.length) {
              loadingSwal.close(); 
              Swal.fire({
                icon: 'success',
                title: 'Mantap!🙌🏽',
                html: `File berhasil diupload dan tersimpan di drive. 
                       <br>Lihat dokumentasi 
                       <a href="https://drive.google.com/drive/folders/1wB26gpzenImF1e1thB2rAW08-CSTbA9h" target="_blank" style="color: #007bff; text-decoration: underline;">disini</a>.`,
            });
            
            }
          }
        };
  
        reader.readAsDataURL(file);  
      }
  
      
      document.getElementById('fileName').textContent = 'Silahkan pilih file kembali';
    });
  
    
    document.getElementById('fileInput').addEventListener('change', function () {
      const fileNameDisplay = document.getElementById('fileName');
      const files = this.files;
      if (files.length > 0) {
        fileNameDisplay.textContent = `File yang diupload: ${files.length} file`;
      } else {
        fileNameDisplay.textContent = 'Silahkan pilih file kembali';
      }
    });
  
    
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  
    
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      alert('Maaf tidak diizinkan!');
    });
  
    document.addEventListener('keydown', (e) => {
      if (
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.shiftKey && (e.key === 'j' || e.key === 'i')) ||
        (e.key === 'F12') // F12
      ) {
        e.preventDefault();
        alert('Saat ini tidak diizinkan!');
      }
    });
  });
  