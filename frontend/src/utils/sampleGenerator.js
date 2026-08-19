// Generates synthetic 28x28-style high contrast fashion images as File objects for testing
export const SAMPLES = [
  { id: 'tshirt', name: 'T-Shirt / Top', icon: '👕', category: 'T-shirt/top' },
  { id: 'sneaker', name: 'Sneaker', icon: '👟', category: 'Sneaker' },
  { id: 'dress', name: 'Dress', icon: '👗', category: 'Dress' },
  { id: 'bag', name: 'Handbag', icon: '👜', category: 'Bag' },
  { id: 'boot', name: 'Ankle Boot', icon: '👢', category: 'Ankle boot' },
  { id: 'trouser', name: 'Trouser', icon: '👖', category: 'Trouser' }
];

export function generateSampleImageFile(sampleId) {
  const canvas = document.createElement('canvas');
  canvas.width = 112;
  canvas.height = 112;
  const ctx = canvas.getContext('2d');

  // Dark background (like Fashion-MNIST black background)
  ctx.fillStyle = '#0a0a0c';
  ctx.fillRect(0, 0, 112, 112);

  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (sampleId === 'tshirt') {
    // Draw T-Shirt shape
    ctx.beginPath();
    ctx.moveTo(36, 24);
    ctx.lineTo(46, 24);
    ctx.arc(56, 24, 10, Math.PI, 0, true);
    ctx.lineTo(76, 24);
    ctx.lineTo(94, 38);
    ctx.lineTo(84, 52);
    ctx.lineTo(76, 46);
    ctx.lineTo(76, 92);
    ctx.lineTo(36, 92);
    ctx.lineTo(36, 46);
    ctx.lineTo(28, 52);
    ctx.lineTo(18, 38);
    ctx.closePath();
    ctx.fill();
  } else if (sampleId === 'sneaker') {
    // Draw Sneaker shape
    ctx.beginPath();
    ctx.moveTo(16, 76);
    ctx.lineTo(96, 76);
    ctx.lineTo(96, 68);
    ctx.lineTo(80, 48);
    ctx.lineTo(60, 48);
    ctx.lineTo(44, 60);
    ctx.lineTo(24, 60);
    ctx.lineTo(16, 68);
    ctx.closePath();
    ctx.fill();
    // Sole line
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(14, 76, 84, 10);
  } else if (sampleId === 'dress') {
    // Draw Dress shape
    ctx.beginPath();
    ctx.moveTo(42, 20);
    ctx.lineTo(50, 20);
    ctx.arc(56, 20, 6, Math.PI, 0, true);
    ctx.lineTo(70, 20);
    ctx.lineTo(74, 40);
    ctx.lineTo(66, 40);
    ctx.lineTo(88, 92);
    ctx.lineTo(24, 92);
    ctx.lineTo(46, 40);
    ctx.lineTo(38, 40);
    ctx.closePath();
    ctx.fill();
  } else if (sampleId === 'bag') {
    // Draw Handbag shape
    // Handle
    ctx.beginPath();
    ctx.arc(56, 36, 18, Math.PI, 0, false);
    ctx.stroke();
    // Body
    ctx.fillRect(28, 36, 56, 52);
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(50, 48, 12, 12);
  } else if (sampleId === 'boot') {
    // Draw Ankle Boot shape
    ctx.beginPath();
    ctx.moveTo(34, 24);
    ctx.lineTo(62, 24);
    ctx.lineTo(62, 54);
    ctx.lineTo(90, 66);
    ctx.lineTo(90, 84);
    ctx.lineTo(28, 84);
    ctx.lineTo(28, 30);
    ctx.closePath();
    ctx.fill();
    // Heel
    ctx.fillStyle = '#dddddd';
    ctx.fillRect(28, 84, 16, 10);
    ctx.fillRect(48, 84, 42, 6);
  } else if (sampleId === 'trouser') {
    // Draw Trousers shape
    ctx.beginPath();
    ctx.moveTo(32, 20);
    ctx.lineTo(80, 20);
    ctx.lineTo(76, 92);
    ctx.lineTo(60, 92);
    ctx.lineTo(56, 48);
    ctx.lineTo(52, 48);
    ctx.lineTo(48, 92);
    ctx.lineTo(32, 92);
    ctx.closePath();
    ctx.fill();
  } else {
    // Fallback circle
    ctx.arc(56, 56, 36, 0, Math.PI * 2);
    ctx.fill();
  }

  const dataUrl = canvas.toDataURL('image/png');
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  const file = new File([u8arr], `sample_${sampleId}.png`, { type: mime });
  return { file, dataUrl };
}
