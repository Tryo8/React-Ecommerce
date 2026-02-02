



export default function Avatar({ name, size = 40 , className}) {
    const stringToColor = (str) => {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = "#";
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xff;
            color += value.toString(16).padStart(2, "0");
        }

        return color;
    };

  const letter = name?.charAt(0).toUpperCase() || "?";
  const bgColor = stringToColor(name || "user");

  return (
    <span className={className}
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: "bold",
        fontSize: size / 2,
        userSelect: "none",
      }}
    >
      {letter}
    </span>
  );
}
