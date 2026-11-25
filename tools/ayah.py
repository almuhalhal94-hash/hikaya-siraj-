import json,sys,urllib.request,os,ssl
ctx=ssl.create_default_context(cafile=os.environ.get('SSL_CERT_FILE') or '/root/.ccr/ca-bundle.crt')
def ayah(ref):
    p=f'/tmp/q_{ref.replace(":","_")}.json'
    if not os.path.exists(p):
        op=urllib.request.build_opener(urllib.request.ProxyHandler(),urllib.request.HTTPSHandler(context=ctx))
        d=json.load(op.open(f'https://api.alquran.cloud/v1/ayah/{ref}/quran-uthmani',timeout=30))
        assert d['code']==200
        json.dump(d,open(p,'w'),ensure_ascii=False)
    return json.load(open(p))['data']['text']
if __name__=='__main__':
    for r in sys.argv[1:]:
        w=ayah(r).split(' ')
        print(r,' '.join(f'[{i}]{x}' for i,x in enumerate(w)))
