import type { BaseCardProps } from "../../types/type";

const BaseCard = ({ 
  title, 
  subtitle, 
  children, 
  footer, 
  image, 
  className = "", 
  onClick 
}: BaseCardProps) => {
  return (
    <div 
      className={`max-w-sm rounded-xl overflow-hidden shadow-lg bg-white border border-gray-200 transition-all hover:shadow-xl ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Hình ảnh minh họa (nếu có) */}
      {image && (
        <img className="w-full h-48 object-cover" src={image} alt={title || "card image"} />
      )}

      <div className="p-5">
        {/* Header: Tiêu đề và chú thích */}
        {(title || subtitle) && (
          <div className="mb-4">
            {title && <h2 className="text-xl font-bold text-gray-800">{title}</h2>}
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        )}

        {/* Body: Nội dung chính (Sử dụng children để linh hoạt nhất) */}
        <div className="text-gray-700 text-base">
          {children}
        </div>
      </div>

      {/* Footer: Thường dùng cho các nút hành động */}
      {footer && (
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
};

export default BaseCard;