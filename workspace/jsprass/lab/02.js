Q = [];

for (i = 1000; --i; i - 10 && i - 13 && i - 34 && i - 39 && i - 92 && Q.push(String.fromCharCode(i)));

L = b.children[2].onclick = function(s) {
    
    i = s = b.children[1].value.replace(/([\r\n]|^)\s*\/\/.*|[\r\n]+\s*/g, '').replace(/\\/g, '\\\\'), X = B = s.length / 2, O = m = '';
    
    for (S = encodeURI(i).replace(/%../g, 'i').length;; m = c + m) {
        for (M = N = e = c = 0, i = Q.length; !c && --i; !~s.indexOf(Q[i]) && (c = Q[i]));
        if (!c) break;
        if (O) {
            o = {};
            for (x in O)
                for (j = s.indexOf(x), o[x] = 0; ~j; o[x]++) j = s.indexOf(x, j + x.length);
            O = o;
        } else
            for (O = o = {}, t = 1; X; t++)
                for (X = i = 0; ++i < s.length - t;)
                    if (!o[x = s.substr(j = i, t)])
                        if (~(j = s.indexOf(x, j + t)))
                            for (X = t, o[x] = 1; ~j; o[x]++) j = s.indexOf(x, j + t);
        for (x in O) {
            j = encodeURI(x).replace(/%../g, 'i').length;
            if (j = (R = O[x]) * j - j - (R + 1) * encodeURI(c).replace(/%../g, 'i').length)(j > M || j == M && R > N) && (M = j, N = R, e = x);
            if (j < 1) delete O[x]
        }
        o = {};
        for (x in O) o[x.split(e).join(c)] = 1;
        O = o;
        if (!e) break;
        s = s.split(e).join(c) + c + e
    }
    c = s.split('"').length < s.split("'").length ? (B = '"', /"/g) : (B = "'", /'/g);
    i = b.children[4].value = '_=' + B + s.replace(c, '\\' + B) + B + ';for(Y in _$=' + B + m + B + ')with(_.split(_$[Y]))_=join(pop());eval(_)';
    i = encodeURI(i).replace(/%../g, 'i').length;
    b.children[3].innerHTML = '从 ' + S + ' Byte 压缩到 ' + i + ' Byte (共压缩了 ' + (i = S - i) + ' Byte, 压缩率：' + ((i / S * 1e4 | 0) / 100) + '%)'
};
