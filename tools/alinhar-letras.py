# Alinha a letra oficial de uma música ao áudio (letra sincronizada, estilo Spotify).
# 1) Transcreve localmente com faster-whisper (tempo de cada palavra); a transcrição fica em cache (<saida>.palavras.json
#    em --cache), para ajustes não exigirem reprocessar o áudio.
# 2) Alinhamento GLOBAL (programação dinâmica, como um diff) entre todas as palavras da letra e todas as palavras
#    transcritas, com comparação aproximada de palavras. Respeita refrões repetidos e a ordem da música.
# 3) Cada verso recebe o tempo da primeira palavra casada; versos sem casamento suficiente são interpolados.
# Uso: python tools/alinhar-letras.py <audio> <letra.txt> <saida.json> [--model medium] [--cache <pasta>]
import sys, os, json, re, unicodedata, difflib, argparse

def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9 ]+", " ", s).split()

def parecido(a, b):
    if a == b: return 1.0
    if min(len(a), len(b)) <= 2: return 0.0
    return difflib.SequenceMatcher(None, a, b).ratio()

def transcrever(audio, modelo_nome, cache):
    if cache and os.path.exists(cache):
        return json.load(open(cache, encoding="utf-8"))
    from faster_whisper import WhisperModel
    modelo = WhisperModel(modelo_nome, device="cpu", compute_type="int8")
    segs, info = modelo.transcribe(audio, language="pt", word_timestamps=True, beam_size=5,
                                   condition_on_previous_text=False, vad_filter=False)
    palavras = []
    for s in segs:
        for w in (s.words or []):
            for t in norm(w.word):
                palavras.append([t, round(w.start, 2), round(w.end, 2)])
    dados = {"duracao": round(info.duration, 2), "palavras": palavras}
    if cache: json.dump(dados, open(cache, "w", encoding="utf-8"), ensure_ascii=False)
    return dados

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("audio"); ap.add_argument("letra"); ap.add_argument("saida")
    ap.add_argument("--model", default="medium"); ap.add_argument("--cache", default="")
    a = ap.parse_args()
    cache = os.path.join(a.cache, os.path.basename(a.saida) + ".palavras.json") if a.cache else ""
    dados = transcrever(a.audio, a.model, cache)
    T = dados["palavras"]; duracao = dados["duracao"]

    linhas, estrofe = [], 0
    for bruto in open(a.letra, encoding="utf-8").read().splitlines():
        if not bruto.strip(): estrofe += 1; continue
        linhas.append({"texto": bruto.strip(), "estrofe": estrofe, "t": None, "casadas": 0, "n": len(norm(bruto))})
    L = []  # (palavra, índice da linha)
    for i, ln in enumerate(linhas):
        for w in norm(ln["texto"]): L.append((w, i))

    # programação dinâmica: pontuação máxima com casamento (sim>=0.7) e lacunas sem custo alto
    n, m = len(L), len(T)
    GAP = -0.15
    dp = [[0.0] * (m + 1) for _ in range(n + 1)]
    bt = [[0] * (m + 1) for _ in range(n + 1)]  # 1 diag, 2 cima (pula letra), 3 esquerda (pula transcrição)
    for i in range(1, n + 1): dp[i][0] = dp[i - 1][0] + GAP; bt[i][0] = 2
    for j in range(1, m + 1): dp[0][j] = dp[0][j - 1] + GAP * 0.3; bt[0][j] = 3
    for i in range(1, n + 1):
        wi = L[i - 1][0]; linha_dp = dp[i]; ant = dp[i - 1]
        for j in range(1, m + 1):
            s = parecido(wi, T[j - 1][0])
            diag = ant[j - 1] + (s * 2 - 0.4 if s >= 0.7 else -0.6)
            cima = ant[j] + GAP
            esq = linha_dp[j - 1] + GAP * 0.3   # palavras transcritas extras (ad-libs, erros) custam pouco
            if diag >= cima and diag >= esq: linha_dp[j] = diag; bt[i][j] = 1
            elif cima >= esq: linha_dp[j] = cima; bt[i][j] = 2
            else: linha_dp[j] = esq; bt[i][j] = 3
    i, j = n, m
    casamentos = {}
    while i > 0 and j > 0:
        if bt[i][j] == 1:
            if parecido(L[i - 1][0], T[j - 1][0]) >= 0.7: casamentos[i - 1] = j - 1
            i -= 1; j -= 1
        elif bt[i][j] == 2: i -= 1
        else: j -= 1
    # tempo de cada verso = primeira palavra casada, exigindo um mínimo de casamento no verso
    pos = 0
    for k, ln in enumerate(linhas):
        idx = list(range(pos, pos + ln["n"])); pos += ln["n"]
        cas = [casamentos[x] for x in idx if x in casamentos]
        ln["casadas"] = len(cas)
        if cas and len(cas) >= max(1, round(ln["n"] * 0.34)):
            primeira = min(idx[q] for q in range(len(idx)) if idx[q] in casamentos)
            desloc = idx.index(primeira)
            t0 = T[casamentos[primeira]][1]
            ln["t"] = round(max(0.0, t0 - desloc * 0.35), 2)   # se a 1ª palavra não casou, recua um pouco
    conhecidos = [(i2, l["t"]) for i2, l in enumerate(linhas) if l["t"] is not None]
    for i2, l in enumerate(linhas):
        if l["t"] is not None: continue
        a0 = max([c for c in conhecidos if c[0] < i2], default=(-1, 0.0), key=lambda c: c[0])
        b0 = min([c for c in conhecidos if c[0] > i2], default=(len(linhas), duracao), key=lambda c: c[0])
        l["t"] = round(a0[1] + (b0[1] - a0[1]) * (i2 - a0[0]) / (b0[0] - a0[0]), 2)
    for i2 in range(1, len(linhas)):
        if linhas[i2]["t"] < linhas[i2 - 1]["t"]: linhas[i2]["t"] = linhas[i2 - 1]["t"]
    diretas = sum(1 for l in linhas if l["casadas"] >= max(1, round(l["n"] * 0.34)))
    json.dump({"duracao": duracao, "linhas": [{"t": l["t"], "texto": l["texto"], "estrofe": l["estrofe"]} for l in linhas]},
              open(a.saida, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"{os.path.basename(a.saida)}: {diretas}/{len(linhas)} versos alinhados diretamente; {len(T)} palavras transcritas; duração {duracao}s")

if __name__ == "__main__":
    main()
