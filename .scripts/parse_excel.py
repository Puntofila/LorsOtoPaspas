import sys, io, json, re, unicodedata
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
import pandas as pd

BRAND_DISPLAY = {
    'aion':'Aion','alpine':'Alpine','alfa romeo':'Alfa Romeo','audi':'Audi',
    'bmw':'BMW','bentley':'Bentley','byd':'BYD',
    'cadillac':'Cadillac','citroen':'Citroen','citroe':'Citroen','chery':'Chery','chevrolet':'Chevrolet','chrysler':'Chrysler','cupra':'Cupra',
    'daihatsu':'Daihatsu','dihatsu':'Daihatsu','dacia':'Dacia','dfsk':'DFSK','ds':'DS','ds3':'DS','ds7':'DS','dodge':'Dodge','daewoo':'Daewoo',
    'ferrari':'Ferrari','foton':'Foton','tunland':'Foton','fiat':'Fiat','piat':'Fiat','ford':'Ford',
    'gmc':'GMC','hyundai':'Hyundai','hyundazi':'Hyundai','honda':'Honda',
    'infiniti':'Infiniti','infinity':'Infiniti','isuzu':'Isuzu',
    'jaguar':'Jaguar','jeep':'Jeep','jaecoo':'Jaecoo',
    'kgm':'KGM','kia':'Kia','khazar':'Khazar',
    'land rover':'Land Rover','lamborghini':'Lamborghini','lamborgini':'Lamborghini','lancia':'Lancia','lincoln':'Lincoln','linkoln':'Lincoln','lexus':'Lexus','leapmotor':'Leapmotor',
    'maserati':'Maserati','mazda':'Mazda',
    'mercedes-benz':'Mercedes-Benz','mercedes':'Mercedes-Benz','mercede':'Mercedes-Benz','mers':'Mercedes-Benz','mersedes':'Mercedes-Benz',
    'mini':'Mini','mitsubishi':'Mitsubishi','mg':'MG',
    'nissan':'Nissan','omoda':'Omoda','opel':'Opel',
    'peugeot':'Peugeot','porsche':'Porsche',
    'renault':'Renault','reno':'Renault','rover':'Rover','rolls-royce':'Rolls-Royce','rolls-roys':'Rolls-Royce','rolls roys':'Rolls-Royce','relive':'Relive',
    'saab':'Saab','seres':'Seres','seat':'SEAT','skywell':'Skywell','skoda':'Skoda','swm':'SWM','smart':'Smart','suzuki':'Suzuki','subaru':'Subaru','ssangyong':'SsangYong','ssang yong':'SsangYong',
    'tesla':'Tesla','togg':'Togg','toyota':'Toyota',
    'volvo':'Volvo','volkswagen':'Volkswagen','volkwagen':'Volkswagen','vw':'Volkswagen','t roc':'Volkswagen','yoyo':'YoYo',
    'berlingo':'Citroen','t03':'Leapmotor',
}

TR_REPLACE = [('İ','I'),('ı','i'),('Ş','S'),('ş','s'),('Ğ','G'),('ğ','g'),('Ç','C'),('ç','c'),('Ö','O'),('ö','o'),('Ü','U'),('ü','u')]

def fold(s):
    for a,b in TR_REPLACE:
        s = s.replace(a,b)
    s = unicodedata.normalize('NFKD', s)
    return ''.join(ch for ch in s if not unicodedata.combining(ch))

def norm_key(s):
    return re.sub(r'\s+',' ', fold(s).lower().strip())

def detect_brand(name):
    n = norm_key(name)
    for key in sorted(BRAND_DISPLAY.keys(), key=lambda k: -len(k)):
        if n.startswith(key + ' ') or n == key:
            return key
    return None

def slugify(s):
    s = fold(s).lower()
    return re.sub(r'[^a-z0-9]+','-',s).strip('-')

KASA_BODY = {
    'sd':'Sedan','sedan':'Sedan',
    'hb':'Hatchback','hatchback':'Hatchback','hechbek':'Hatchback','hecbek':'Hatchback',
    'sw':'Wagon','combi':'Wagon','wagon':'Wagon','t-modell':'Wagon','touring':'Wagon',
    'suv':'SUV','crossover':'Crossover',
    'mpv':'MPV','minivan':'MPV','van':'Van','minibus':'Van','pickup':'Pickup','pikap':'Pickup',
    'coupe':'Coupe','kupe':'Coupe',
    'cabrio':'Cabrio','cabriolet':'Cabrio','convertible':'Cabrio','spyder':'Cabrio',
}
def detect_body(kasa):
    if not kasa: return None
    k = fold(kasa).lower().strip()
    if k in KASA_BODY: return KASA_BODY[k]
    for p in re.split(r'[\s/+-]+', k):
        if p in KASA_BODY: return KASA_BODY[p]
    return kasa.strip()

def yes(s):
    if not s: return False
    s = fold(s).lower()
    if 'degil' in s or 'yok' in s: return False
    return 'var' in s or s.strip() in ('3d','tek')

def detect_year(name):
    m = re.search(r'(?:19|20)\d{2}\s*[-–]\s*(?:(?:19|20)?\d{2}|202\.\.|20\d{2}\.\.|202!|2\d{3})', name)
    if m: return re.sub(r'\s*[-–]\s*', '-', m.group(0))
    m = re.search(r'(?:19|20)\d{2}\+?', name)
    return m.group(0) if m else ''

df = pd.read_excel(r'C:\Users\VERSUM\Downloads\AyuGram Desktop\2024.xlsx', sheet_name='Лист1', header=None)

groups = {}
unmatched = []
for i, row in df.iterrows():
    if i == 0: continue
    if pd.isna(row[0]): continue
    name = re.sub(r'\s+',' ', str(row[0]).strip())
    if pd.isna(row[7]) and pd.isna(row[8]): continue
    key = detect_brand(name)
    if not key:
        unmatched.append(name); continue
    display = BRAND_DISPLAY[key]
    groups.setdefault(display, []).append((key, name, row))

print('UNMATCHED:', unmatched)

def n(v): return re.sub(r'\s+',' ', str(v).strip()) if pd.notna(v) else None

lines = []
lines.append('export type Brand = { slug: string; name: string; models: Model[] };')
lines.append('export type Model = { slug: string; name: string; fullName: string; years: string; bodyType?: string; kod?: string; has3D?: boolean; hasTrunk?: boolean; tekParca?: boolean; photos?: string[]; note?: string };')
lines.append('')
lines.append('export const BRANDS: Brand[] = [')

for display in sorted(groups.keys(), key=str.lower):
    bslug = slugify(display)
    lines.append('  {')
    lines.append(f'    slug: {json.dumps(bslug)},')
    lines.append(f'    name: {json.dumps(display)},')
    lines.append('    models: [')
    seen = set()
    for key, full, row in groups[display]:
        short = re.sub(r'^' + re.escape(key) + r'\s*', '', full, flags=re.IGNORECASE).strip() or full
        s = slugify(short) or 'model'
        base = s; k = 2
        while s in seen:
            s = f'{base}-{k}'; k += 1
        seen.add(s)
        kasa = n(row[8])
        body = detect_body(kasa)
        photo_text = ' '.join(str(row[c]) for c in (14,15) if pd.notna(row[c]))
        photos = re.findall(r'https?://\S+', photo_text)
        note_val = n(row[13]) if pd.notna(row[13]) and 'http' not in str(row[13]) else None
        kod = n(row[7])
        has3 = yes(n(row[9]))
        bag = yes(n(row[10]))
        tek = yes(n(row[11]))
        lines.append('      {')
        lines.append(f'        slug: {json.dumps(s)},')
        lines.append(f'        name: {json.dumps(short)},')
        lines.append(f'        fullName: {json.dumps(full)},')
        lines.append(f'        years: {json.dumps(detect_year(full))},')
        if body: lines.append(f'        bodyType: {json.dumps(body)},')
        if kod: lines.append(f'        kod: {json.dumps(kod)},')
        lines.append(f'        has3D: {str(has3).lower()},')
        lines.append(f'        hasTrunk: {str(bag).lower()},')
        lines.append(f'        tekParca: {str(tek).lower()},')
        if photos: lines.append(f'        photos: {json.dumps(photos)},')
        if note_val: lines.append(f'        note: {json.dumps(note_val)},')
        lines.append('      },')
    lines.append('    ],')
    lines.append('  },')

lines.append('];')
lines.append('')
lines.append('export function getBrand(slug: string): Brand | undefined { return BRANDS.find((b) => b.slug === slug); }')
lines.append('export function getModel(brandSlug: string, modelSlug: string): { brand: Brand; model: Model } | undefined {')
lines.append('  const brand = getBrand(brandSlug); if (!brand) return undefined;')
lines.append('  const model = brand.models.find((m) => m.slug === modelSlug); if (!model) return undefined;')
lines.append('  return { brand, model };')
lines.append('}')

with open(r'C:\Users\VERSUM\Documents\LorsPaspas - web\src\lib\data\brands.ts','w',encoding='utf-8') as f:
    f.write('\n'.join(lines))

total = sum(len(v) for v in groups.values())
print(f'BRANDS: {len(groups)}, MODELS: {total}')
print('First 5 slugs:', [slugify(d) for d in list(groups.keys())[:5]])
