export const getDicebearAvatarUrl = (name: string) => {
  return `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(name)}&scale=80&backgroundType=gradientLinear`;
};

export const getInitialsAvatarUrl = (name: string, length = 2) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128&length=${length}`;
  };
  