import geoip from "geoip-lite";

export const getUserLocation = (req, res, next) => {
    const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket.remoteAddress;

    const testIp = "208.67.222.222"; // TEST

    const geo = geoip.lookup(testIp);

    const countryName = geo?.country
        ? new Intl.DisplayNames(["en"], { type: "region" }).of(geo.country)
        : null;

    res.json({
        ip,
        country: geo?.country || null,
        countryName,
        city: geo?.city || null,
        region: geo?.region || null,
        timezone: geo?.timezone || null,
        latitude: geo?.ll?.[0] || null,   
        longitude: geo?.ll?.[1] || null   
    });
}