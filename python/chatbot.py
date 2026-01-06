import numpy as np

# Speed of light (m/s)
c = 3e8

# Satellite data: [x, y, z, pseudorange]
satellites = np.array(
    [
        [15600000.0, 7540000.0, 20140000.0, 21400000.0],
        [18760000.0, 2750000.0, 18600000.0, 21350000.0],
        [17600000.0, 14600000.0, 13400000.0, 21100000.0],
        [19170000.0, 6100000.0, 18390000.0, 21490000.0],
    ]
)

# Initial guess for receiver position and clock bias
x, y, z, dt = 0.0, 0.0, 0.0, 0.0

# Iterative least squares
for _ in range(10):
    A = []
    B = []

    for sat in satellites:
        xi, yi, zi, ri = sat
        rho = np.sqrt((x - xi) ** 2 + (y - yi) ** 2 + (z - zi) ** 2)

        A.append([(x - xi) / rho, (y - yi) / rho, (z - zi) / rho, c])

        B.append(ri + c * dt - rho)

    A = np.array(A)
    B = np.array(B)

    # Least squares solution
    delta = np.linalg.lstsq(A, B, rcond=None)[0]

    x += delta[0]
    y += delta[1]
    z += delta[2]
    dt += delta[3]

print("ECEF Coordinates:")
print(f"x = {x:.2f} m")
print(f"y = {y:.2f} m")
print(f"z = {z:.2f} m")
print(f"Clock bias = {dt:.6e} s")

# --------- ECEF to Geographical Coordinates ---------

# WGS84 constants
a = 6378137.0
e2 = 6.69e-3

p = np.sqrt(x**2 + y**2)
longitude = np.arctan2(y, x)
latitude = np.arctan2(z, p * (1 - e2))
N = a / np.sqrt(1 - e2 * np.sin(latitude) ** 2)
h = p / np.cos(latitude) - N

print("\nGeographical Coordinates:")
print(f"Latitude = {np.degrees(latitude):.6f} degrees")
print(f"Longitude = {np.degrees(longitude):.6f} degrees")
print(f"Altitude = {h:.2f} m")
