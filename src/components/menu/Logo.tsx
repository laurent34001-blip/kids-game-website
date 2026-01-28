type LogoProps = {
  className?: string;
  state?: string;
  img?: string;
  vector?: string;
  vector1?: string;
  vector2?: string;
  vector3?: string;
  vector4?: string;
  vector5?: string;
};

const assetMap: Record<string, string> = {
  "vector-7.svg": "lettre_d.svg",
  "vector-8.svg": "lettre_j.svg",
  "vector-9.svg": "lettre_o.svg",
  "vector-10.svg": "lettre_g.svg",
  "vector-11.svg": "lettre_o.svg",
  "vector-12.svg": "lettre_o.svg",
  "vector-13.svg": "lettre_o.svg",
};

const resolveAsset = (asset?: string) => {
  if (!asset) return null;
  if (asset.startsWith("/") || asset.startsWith("http")) return asset;
  const mapped = assetMap[asset] ?? asset;
  return `/djogo_icon/${mapped}`;
};

export const Logo = ({
  className,
  state,
  img,
  vector,
  vector1,
  vector2,
  vector3,
}: LogoProps) => {
  const sources = [img, vector, vector1, vector2, vector3]
    .map(resolveAsset)
    .filter((src): src is string => Boolean(src));

  return (
    <div className={["logo", className, state].filter(Boolean).join(" ")}>
      {sources.map((src, index) => (
        <img key={`${src}-${index}`} src={src} alt="Djogo" />
      ))}
    </div>
  );
};
