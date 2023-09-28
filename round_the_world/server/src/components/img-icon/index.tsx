interface imgIconProps {
  url: string;
  size: number;
  onClick?: () => void;
}
const ImgIcon = ({ url, size, onClick }: imgIconProps) => {
  return (
    <img
      src={url}
      style={{
        width: `${size}rem`,
        height: `${size}rem`,
      }}
      onClick={onClick}
    />
  );
};

export default ImgIcon;
