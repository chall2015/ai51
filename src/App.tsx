/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Image as ImageIcon, RotateCcw, Download, Gift, ArrowRight, X, Sparkles } from 'lucide-react';

// --- 常量与地标数据 ---

const CITIES = [
  { name: '杭州西湖', seed: 'hanzhou-westlake', desc: '烟雨江南，西子湖畔的淡妆浓抹', img: 'https://images.unsplash.com/photo-1599661413158-b61596765792?q=80&w=750&auto=format&fit=crop' },
  { name: '嘉兴南湖', seed: 'lake-boat', desc: '轻舟湖影，追寻那一抹红色的记忆', img: 'https://images.unsplash.com/photo-1596431764619-fa810237785a?q=80&w=750&auto=format&fit=crop' },
  { name: '宁波东钱湖', seed: 'blue-lake', desc: '浙东明珠，饱览山色与湖光的交融', img: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=750&auto=format&fit=crop' },
  { name: '舟山普陀山', seed: 'putuo-mountain', desc: '海天佛国，听涛声中的梵音空灵', img: 'https://images.unsplash.com/photo-1524823292491-d131f13b19ec?q=80&w=750&auto=format&fit=crop' },
  { name: '金华双龙洞', seed: 'cave-stalactite', desc: '卧舟进洞，探寻奇幻多姿的溶洞奇观', img: 'https://images.unsplash.com/photo-1533224861214-cb500f9e9ad1?q=80&w=750&auto=format&fit=crop' },
  { name: '绍兴安昌', seed: 'ancient-town-water', desc: '石板古道，江南水乡的淳朴烟火气', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=750&auto=format&fit=crop' },
  { name: '温州雁荡山', seed: 'mountain-peaks', desc: '海上名山，寰中绝胜的奇峰异石', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=750&auto=format&fit=crop' },
  { name: '湖州南浔', seed: 'nanxun-water-town', desc: '丝绸之府，中西合璧的百间楼影', img: 'https://images.unsplash.com/photo-1477586957327-847a0f3f4fe3?q=80&w=750&auto=format&fit=crop' },
  { name: '台州神仙居', seed: 'peaks-clouds', desc: '仙山琼阁，漫步在如梦似幻的云端', img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=750&auto=format&fit=crop' },
  { name: '衢州江郎山', seed: 'three-rocks', desc: '三峰耸立，尽情领略雄伟奇绝的丹霞', img: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=750&auto=format&fit=crop' },
  { name: '丽水古堰', seed: 'old-village-river', desc: '千年古韵，如诗如画的瓯江畔人家', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=750&auto=format&fit=crop' },
];

type AppState = 'landing' | 'selection' | 'wipe' | 'result';

// --- 通用组件 ---

const Button = ({ children, onClick, className = "", variant = "primary" }: any) => {
  const baseStyles = "px-8 py-4 rounded-full font-bold transition-all duration-300 active:scale-95 shadow-lg text-base";
  const variants: any = {
    primary: "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200/50",
    outline: "bg-white/90 backdrop-blur-sm border border-gray-100 text-gray-700 hover:bg-white",
    ghost: "bg-white/20 backdrop-blur-md text-white hover:bg-white/30"
  };
  return (
    <button id={`btn-${variant}`} onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default function App() {
  const [state, setState] = useState<AppState>('landing');
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);

  const handleStart = () => setState('selection');
  
  const handlePhotoUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserPhoto(event.target?.result as string);
        setState('wipe'); // 选完照片直接进入擦拭页
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWipeComplete = () => setState('result');
  const handleReset = () => {
    setState('landing');
    setUserPhoto(null);
  };

  return (
    <div className="h-screen w-full bg-[#fdfaf6] font-sans flex items-center justify-center overflow-hidden p-4">
      <div className="relative w-full max-w-[375px] h-full max-h-[812px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col border-[6px] border-white transition-all duration-500 aspect-[750/1624]">
        <AnimatePresence mode="wait">
          {state === 'landing' && <LandingPage key="landing" onStart={handleStart} />}
          {state === 'selection' && (
            <SelectionPage
              key="selection"
              onUpload={handlePhotoUpload}
              onBack={() => setState('landing')}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
            />
          )}
          {state === 'wipe' && (
            <WipePage
              key="wipe"
              city={selectedCity}
              onComplete={handleWipeComplete}
              userPhoto={userPhoto}
            />
          )}
          {state === 'result' && (
            <ResultPage
              key="result"
              city={selectedCity}
              onReset={handleReset}
              userPhoto={userPhoto}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- 页面组件 ---

function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-full w-full flex flex-col items-center justify-start pt-32 pb-24 text-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=750&auto=format&fit=crop"
          className="h-full w-full object-cover"
          alt="唯美风景"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white/90" />
      </div>
      
      <div className="relative z-10 px-8 flex flex-col items-center flex-1 justify-between">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-black text-white leading-tight tracking-[0.1em] drop-shadow-xl"
        >
          五一，<br />
          换个时空去呼吸
        </motion.h1>
        
        <motion.div
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ delay: 0.4 }}
           className="w-full"
        >
          <Button onClick={onStart} className="w-64">开启出逃计划</Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

function SelectionPage({ onUpload, onBack, selectedCity, setSelectedCity }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleConfirm = () => {
    fileInputRef.current?.click(); // 点击按钮拉起系统相机/照片
  };

  // 添加鼠标滚轮横向滚动支持
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          el.scrollLeft += e.deltaY;
        }
      };
      el.addEventListener('wheel', onWheel, { passive: false });
      return () => el.removeEventListener('wheel', onWheel);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full w-full flex flex-col bg-white"
    >
      <div className="p-4 text-center border-b border-gray-100 bg-white relative">
        <span className="text-[11px] font-bold tracking-[0.2em] text-gray-400">第一步 / 选择出逃目的地</span>
        <button onClick={onBack} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors hover:text-gray-600"><X size={20} /></button>
      </div>

      <div className="flex-1 flex flex-col min-h-0 bg-gray-50/50">
        <div className="px-6 pt-8 pb-4 flex items-end justify-between">
          <div>
             <h3 className="text-xl font-black text-gray-800 tracking-wider">目的地空间</h3>
             <p className="text-[10px] text-gray-400 mt-1">左右滑动切换不同的平行世界</p>
          </div>
          <Sparkles size={20} className="text-orange-400" />
        </div>
        
        <div className="relative flex-1 min-h-0 w-full flex items-center">
           {/* 左右滑动指示提示 */}
           <div className="absolute left-1 z-20 pointer-events-none text-gray-300/50 animate-pulse"><ArrowRight size={20} className="rotate-180" /></div>
           <div className="absolute right-1 z-20 pointer-events-none text-gray-300/50 animate-pulse"><ArrowRight size={20} /></div>
           
           {/* 边缘渐变遮罩 */}
           <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-gray-50/80 to-transparent z-10 pointer-events-none" />
           <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-gray-50/80 to-transparent z-10 pointer-events-none" />

           <div 
             ref={scrollRef}
             className="w-full h-full flex overflow-x-auto no-scrollbar gap-4 px-12 snap-x snap-mandatory items-center py-4 cursor-grab active:cursor-grabbing touch-pan-x"
           >
              {CITIES.map((city) => (
                <motion.div
                  key={city.name}
                  id={`city-${city.name}`}
                  onClick={() => {
                      setSelectedCity(city);
                      document.getElementById(`city-${city.name}`)?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                  }}
                  className={`flex-none w-64 snap-center relative rounded-[32px] overflow-hidden cursor-pointer transition-all duration-500 border-2 aspect-[9/14] ${
                     selectedCity.name === city.name ? 'border-orange-500 scale-100 shadow-[0_20px_40px_rgba(249,115,22,0.3)]' : 'border-white scale-90 opacity-40 hover:opacity-100'
                  }`}
                >
                   <img src={city.img} className="w-full h-full object-cover pointer-events-none select-none" alt={city.name} />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                   <div className="absolute bottom-6 left-6 right-6 text-white pointer-events-none">
                      <p className="text-base font-black text-orange-400 mb-1">{city.name}</p>
                      <p className="text-[11px] opacity-80 leading-relaxed font-medium line-clamp-2">{city.desc}</p>
                   </div>
                   {selectedCity.name === city.name && (
                      <div className="absolute top-6 right-6 bg-orange-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1 shadow-lg border border-white/20">
                         目的地已锁定 <ImageIcon size={10} />
                      </div>
                   )}
                </motion.div>
              ))}
           </div>
        </div>
      </div>

      <div className="p-8 bg-white border-t border-gray-50">
        <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={onUpload} />
        <Button 
           onClick={handleConfirm} 
           className="w-full relative overflow-hidden h-16"
        >
          锁定目的地 · 上传瞬间
          <motion.div animate={{ x: [0, 400] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-y-0 w-12 bg-white/20 skew-x-12 -left-12" />
        </Button>
        <p className="text-center mt-3 text-[10px] text-gray-300 font-medium tracking-wider">点击后将拉起相册或相机以获取您的照片</p>
      </div>
    </motion.div>
  );
}

function WipePage({ city, onComplete, userPhoto }: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isWiping, setIsWiping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [wipeProgress, setWipeProgress] = useState(0);

  const animeScenery = city.img; // 直接使用地标图片
  const bwOffice = `https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=750&auto=format&fit=crop`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = bwOffice;
    img.onload = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.filter = 'grayscale(100%) brightness(0.6)';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }, []);

  const handleWipe = useCallback((e: any) => {
    if (!isWiping) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX || (e.touches && e.touches[0].clientX)) - rect.left) || 0;
    const y = ((e.clientY || (e.touches && e.touches[0].clientY)) - rect.top) || 0;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 60, 0, Math.PI * 2);
    ctx.fill();
    setWipeProgress(prev => Math.min(prev + 0.8, 100));
  }, [isWiping]);

  useEffect(() => {
    if (wipeProgress >= 80 && !isComplete) {
      setIsComplete(true);
      setTimeout(onComplete, 1500);
    }
  }, [wipeProgress, isComplete, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full w-full relative bg-black overflow-hidden"
      onMouseDown={() => setIsWiping(true)}
      onMouseUp={() => setIsWiping(false)}
      onTouchStart={() => setIsWiping(true)}
      onTouchEnd={() => setIsWiping(false)}
      onMouseMove={handleWipe}
      onTouchMove={handleWipe}
    >
      <div className="absolute inset-0">
        <img src={animeScenery} className="w-full h-full object-cover" alt="风景" />
        <div className="absolute inset-x-0 bottom-32 h-1/2 flex items-center justify-center">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-48 aspect-[9/16] border-[6px] border-white shadow-2xl rounded-2xl overflow-hidden relative"
          >
             <img src={userPhoto} className="w-full h-full object-cover" alt="照片" />
             <div className="absolute inset-0 bg-blue-400/10 mix-blend-overlay" />
          </motion.div>
        </div>
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 cursor-none touch-none" />

      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-between p-10">
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-full px-6 py-2 text-[10px] text-white font-black tracking-widest uppercase shadow-xl">
          擦掉残存的工作痕迹
        </div>
        
        <div className="mb-14 text-center">
           <div className="w-1 bg-white/40 h-16 mx-auto rounded-full mb-4 overflow-hidden">
              <motion.div initial={{ height: 0 }} animate={{ height: '100%' }} className="w-full bg-orange-400" />
           </div>
           <p className="text-white text-base font-black tracking-widest drop-shadow-xl underline underline-offset-8 decoration-orange-400">擦掉疲惫，去见想见的风景</p>
        </div>
      </div>
    </motion.div>
  );
}

function ResultPage({ city, onReset, userPhoto }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full w-full flex flex-col bg-[#f8f9fb] overflow-y-auto no-scrollbar px-6 py-10"
    >
      {/* 核心海报区域 */}
      <div className="shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] flex-1 flex flex-col rounded-[32px] overflow-hidden bg-white relative">
        <div className="relative aspect-[9/16] w-full h-full overflow-hidden">
           {/* 背景大图 */}
           <img src={city.img} className="absolute inset-0 w-full h-full object-cover" alt="背景" />
           
           {/* 层次感遮罩：顶部微暗，底部深色渐变 */}
           <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
           
           {/* 顶部装饰线与年份 */}
           <div className="absolute top-8 left-8 right-8 flex justify-between items-center text-white/90">
              <div className="h-[1px] flex-1 bg-white/30 mr-4" />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase">M X X V I</span>
              <div className="h-[1px] flex-1 bg-white/30 ml-4" />
           </div>

           {/* 核心主体：照片框（拍立得质感） */}
           <div className="absolute inset-0 flex items-center justify-center -mt-12">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: -3 }}
                transition={{ type: "spring", damping: 15 }}
                className="w-[180px] aspect-[3/4] bg-white p-3 pb-12 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] rounded-sm transform"
              >
                 <div className="w-full h-full bg-gray-100 overflow-hidden relative">
                    <img src={userPhoto} className="w-full h-full object-cover" alt="用户" />
                    <div className="absolute inset-0 block bg-blue-500/10 mix-blend-overlay" />
                 </div>
                 {/* 手写感装饰 */}
                 <div className="absolute bottom-3 left-0 right-0 text-center">
                    <span className="text-[10px] font-serif italic text-gray-400">Captured in Parallel Space</span>
                 </div>
              </motion.div>
           </div>

           {/* 底部文字信息区 */}
           <div className="absolute bottom-10 left-8 right-8 text-white">
              {/* 地标大标题 - 镂空感或极粗体 */}
              <motion.div 
                 initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-baseline gap-2 mb-2"
              >
                <h3 className="text-5xl font-black tracking-tighter italic">{city.name.slice(0, 2)}</h3>
                <h3 className="text-2xl font-black tracking-tight opacity-80">{city.name.slice(2)}</h3>
              </motion.div>
              
              {/* 分割线 */}
              <div className="w-12 h-1 bg-orange-500 mb-4" />

              {/* 情感金句 */}
              <p className="text-xs font-bold text-white/90 tracking-wide mb-6 leading-relaxed">
                 叮！我已成功切换至<span className="text-orange-400">[{city.name}]</span>，<br />
                 五一开启。在这里，连空气都是自由的味道。
              </p>

              {/* 页脚详情 */}
              <div className="flex justify-between items-end border-t border-white/10 pt-4">
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Date / 2026.05.01</span>
                    <span className="text-[9px] font-medium text-white/40">坐标：浙江 · {city.name}</span>
                 </div>
                 {/* 模拟二维码区 */}
                 <div className="w-10 h-10 border border-white/20 rounded-lg flex items-center justify-center p-1">
                    <div className="w-full h-full bg-white/10 rounded-sm grid grid-cols-2 gap-0.5">
                       <div className="bg-white/40"></div><div className="bg-white/10"></div>
                       <div className="bg-white/10"></div><div className="bg-white/40"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* 底部操作按钮 */}
      <div className="mt-10 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button variant="primary" className="py-4 px-0 h-16 flex items-center justify-center gap-3 whitespace-nowrap text-sm">
            <Download size={20} /> 保存海报
          </Button>
          <Button variant="outline" onClick={onReset} className="py-4 px-0 h-16 flex items-center justify-center gap-3 whitespace-nowrap text-sm">
            <RotateCcw size={20} /> 再玩一次
          </Button>
        </div>
        
        <motion.button
           whileTap={{ scale: 0.98 }}
           className="w-full py-5 bg-blue-600 text-white rounded-[24px] text-sm font-black flex items-center justify-center gap-3 shadow-xl transition-all hover:bg-blue-700"
        >
          <Gift size={20} /> 解锁五一专属福利
        </motion.button>
      </div>
    </motion.div>
  );
}

