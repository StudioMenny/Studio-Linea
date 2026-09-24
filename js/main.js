/* =========================================================
   STUDIO LINEA — main.js
   ========================================================= */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     1. DISEGNI — prospetti in SVG (viewBox 600 x 340, terreno a y=300)
     classi: m muro, s copertura/ombra, v vetro, d telai, k crepe,
             t terreno, a alberi, q quote (visibili in modalità progetto)
     --------------------------------------------------------- */
  const P = (c, d) => `<path class="${c}" d="${d}" pathLength="1"/>`;
  const C = (c, x, y, r) => P(c, `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`);
  const T = (x, y, s, v) => `<text x="${x}" y="${y}"${v ? ` transform="rotate(-90 ${x} ${y})"` : ''}>${s}</text>`;
  const DH = (a, b, y, s) => P('q', `M${a} ${y}H${b}M${a} ${y - 6}V${y + 6}M${b} ${y - 6}V${y + 6}`) + T((a + b) / 2, y - 9, s);
  const DV = (a, b, x, s) => P('q', `M${x} ${a}V${b}M${x - 6} ${a}H${x + 6}M${x - 6} ${b}H${x + 6}`) + T(x - 9, (a + b) / 2, s, 1);
  const TR = (x, r) => C('a', x, 278 - r, r) + P('t', `M${x} 278V300`);
  const G = P('t', 'M8 300H592');

  const DRAW = {
    villa: G + TR(38, 24) +
      P('m', 'M80 300V200H380V300Z') +
      P('m', 'M180 200V130H520V200Z') +
      P('s', 'M380 200H520V209H380Z') +
      P('d', 'M168 130H532') +
      P('v', 'M110 290V216H262V290Z') + P('d', 'M161 216V290M212 216V290') +
      P('v', 'M300 300V228H340V300Z') +
      P('v', 'M200 150H272V181H200Z') +
      P('v', 'M300 146H505V186H300Z') + P('d', 'M351 146V186M402 146V186M453 146V186') +
      P('t', 'M506 209V300') +
      DH(80, 520, 104, '14,60') + DV(130, 300, 566, '5,70'),

    casale: G + TR(58, 24) +
      P('m', 'M120 300V172H420V300Z') +
      P('s', 'M104 176L270 92L436 176Z') +
      P('v', 'M200 300V206H340V300Z') + P('d', 'M270 206V300M200 252H340') +
      P('v', 'M146 214H180V256H146Z') + P('v', 'M366 214H400V256H366Z') +
      P('m', 'M420 300V212H548V300Z') + P('d', 'M413 212H555') +
      P('v', 'M432 290V224H536V290Z') + P('d', 'M484 224V290') +
      DH(120, 548, 64, '17,80') + DV(92, 300, 578, '8,40'),

    interno:
      P('s', 'M200 250H400L540 320H60Z') +
      P('m', 'M200 110H400V250H200Z') +
      P('t', 'M200 110L60 40M400 110L540 40M200 250L60 320M400 250L540 320') +
      P('v', 'M232 128H368V226H232Z') + P('d', 'M300 128V226M232 177H368') +
      P('t', 'M250 250L205 320M300 250V320M350 250L395 320') +
      P('m', 'M226 292V272H374V292Z') + P('s', 'M226 272V258H374V272Z') +
      P('t', 'M300 44V74') + C('v', 300, 82, 8) +
      P('t', 'M96 112L174 132M96 152L174 164M96 192L174 198') +
      P('s', 'M462 300V282H482V300Z') + C('a', 472, 264, 17) +
      DH(200, 400, 28, '6,20'),

    negozio: G + TR(96, 18) + TR(510, 18) +
      P('m', 'M140 300V112H460V300Z') + P('d', 'M132 112H468') +
      P('v', 'M175 132H235V168H175Z') + P('v', 'M270 132H330V168H270Z') + P('v', 'M365 132H425V168H365Z') +
      P('s', 'M190 178H410V196H190Z') + `<text class="sg" x="300" y="191">NOVE</text>` +
      P('s', 'M120 206H480V218H120Z') +
      P('v', 'M165 300V224H435V300Z') + P('d', 'M245 224V300M355 224V300') +
      P('m', 'M278 300V232H322V300Z') + P('t', 'M313 262V274') +
      DH(140, 460, 78, '10,70') + DV(112, 300, 566, '6,30'),

    torre: G + TR(146, 22) + TR(552, 18) +
      P('m', 'M210 300V52H390V300Z') + P('d', 'M200 52H400') +
      [70, 100, 130, 160, 190, 220].map(y => P('v', `M222 ${y}H378V${y + 18}H222Z`)).join('') +
      P('d', 'M261 70V238M300 70V238M339 70V238') +
      P('v', 'M236 300V256H364V300Z') + P('d', 'M300 256V300') +
      P('m', 'M390 300V196H510V300Z') + P('v', 'M402 214H498V262H402Z') + P('d', 'M450 214V262') +
      DV(52, 300, 186, '26,40') + DH(210, 510, 30, '12,80'),

    padiglione: G + TR(26, 20) + TR(574, 18) +
      P('s', 'M50 188H550V204H50Z') +
      P('v', 'M84 204H516V296H84Z') + P('d', 'M144 204V296M204 204V296M384 204V296M444 204V296') +
      P('m', 'M250 204V296H340V204Z') +
      P('m', 'M70 296H530V300H70Z') +
      P('t', 'M60 204V296M540 204V296') +
      DH(50, 550, 158, '42,00')
  };

  /* disegni ricalcati sulle foto dei progetti (coordinate in pixel della foto) */
  DRAW.velaF = { vb: '0 0 1176 779', big: true, photo: true, d: "<path class=\"t\" d=\"M0 497L380 476L1176 470\" pathLength=\"1\"/><path class=\"a\" d=\"M-20 290a75 75 0 1 0 150 0a75 75 0 1 0 -150 0\" pathLength=\"1\"/><path class=\"t\" d=\"M55 365V490\" pathLength=\"1\"/><path class=\"m\" d=\"M30 345H388V476H30Z\" pathLength=\"1\"/><path class=\"k\" d=\"M52 345V476M74 345V476M96 345V476M118 345V476M140 345V476M162 345V476M184 345V476M206 345V476M228 345V476M250 345V476M272 345V476M294 345V476M316 345V476M338 345V476M360 345V476M382 345V476\" pathLength=\"1\"/><path class=\"m\" d=\"M388 352H700V466H388Z\" pathLength=\"1\"/><path class=\"v\" d=\"M700 352H1045V470H700Z\" pathLength=\"1\"/><path class=\"d\" d=\"M752 352V470M792 352V470M945 352V470M992 352V470\" pathLength=\"1\"/><path class=\"m\" d=\"M1045 352H1068V470H1045Z\" pathLength=\"1\"/><path class=\"m\" d=\"M112 230L240 112L770 286L565 258L200 212Z\" pathLength=\"1\"/><path class=\"s\" d=\"M112 230L240 108L774 284L768 292L240 118L122 232Z\" pathLength=\"1\"/><path class=\"m\" d=\"M200 212L565 258V300L200 292Z\" pathLength=\"1\"/><path class=\"v\" d=\"M300 214H380V298H300Z\" pathLength=\"1\"/><path class=\"v\" d=\"M415 236H452V300H415Z\" pathLength=\"1\"/><path class=\"v\" d=\"M482 262H556V300H482Z\" pathLength=\"1\"/><path class=\"s\" d=\"M565 258L722 280V300L565 300Z\" pathLength=\"1\"/><path class=\"k\" d=\"M585 261V300M605 264V300M625 266V300M645 269V300M665 272V300M685 275V300M705 278V300\" pathLength=\"1\"/><path class=\"s\" d=\"M128 284L612 330L612 338L128 292Z\" pathLength=\"1\"/><path class=\"m\" d=\"M140 292L605 338L560 352L150 314Z\" pathLength=\"1\"/><path class=\"s\" d=\"M598 322L1084 278L1092 290L604 334Z\" pathLength=\"1\"/><path class=\"m\" d=\"M604 334L1092 290L1106 346L612 362Z\" pathLength=\"1\"/><path class=\"v\" d=\"M525 474L880 482L832 526L620 496Z\" pathLength=\"1\"/><path class=\"t\" d=\"M330 470H1100\" pathLength=\"1\"/><path class=\"q\" d=\"M112 66H1106M112 52V80M1106 52V80\" pathLength=\"1\"/><text x=\"609.0\" y=\"54\">24,50</text><path class=\"q\" d=\"M1140 110V476M1126 110H1154M1126 476H1154\" pathLength=\"1\"/><text x=\"1128\" y=\"293.0\" transform=\"rotate(-90 1128 293.0)\">8,20</text>" };
  DRAW.valliF = { vb: '0 0 1074 806', big: true, photo: true, d: "<path class=\"s\" d=\"M0 118L455 92L400 214L0 226Z\" pathLength=\"1\"/><path class=\"m\" d=\"M298 66H360V106H298Z\" pathLength=\"1\"/><path class=\"v\" d=\"M100 306L140 222L395 212L355 306Z\" pathLength=\"1\"/><path class=\"d\" d=\"M180 306L220 220M260 306L295 216M320 306L350 214\" pathLength=\"1\"/><path class=\"v\" d=\"M140 350H322V600H140Z\" pathLength=\"1\"/><path class=\"d\" d=\"M200 350V600M262 350V600\" pathLength=\"1\"/><path class=\"m\" d=\"M320 344H362V600H320Z\" pathLength=\"1\"/><path class=\"m\" d=\"M348 322L485 80L516 290L505 300L482 118L362 330Z\" pathLength=\"1\"/><path class=\"v\" d=\"M362 330L482 118L500 282V600H362Z\" pathLength=\"1\"/><path class=\"d\" d=\"M420 225V600M458 170V600M362 400H500M362 470H500M362 530H500\" pathLength=\"1\"/><path class=\"m\" d=\"M500 118H565V150L578 160V600H500Z\" pathLength=\"1\"/><path class=\"s\" d=\"M565 222L910 205V262L558 272Z\" pathLength=\"1\"/><path class=\"m\" d=\"M555 272L905 258V276L555 290Z\" pathLength=\"1\"/><path class=\"m\" d=\"M565 290L935 280V600H565Z\" pathLength=\"1\"/><path class=\"v\" d=\"M572 600V355Q628 300 684 355V600Z\" pathLength=\"1\"/><path class=\"d\" d=\"M628 322V600M572 412H684M572 470H684\" pathLength=\"1\"/><path class=\"v\" d=\"M700 600V355Q746 300 793 355V600Z\" pathLength=\"1\"/><path class=\"d\" d=\"M746 322V600M700 412H793M700 470H793\" pathLength=\"1\"/><path class=\"v\" d=\"M806 600V355Q870 300 935 355V600Z\" pathLength=\"1\"/><path class=\"d\" d=\"M870 322V600M806 412H935M806 470H935\" pathLength=\"1\"/><path class=\"m\" d=\"M912 95H990V240H912Z\" pathLength=\"1\"/><path class=\"t\" d=\"M0 770L1074 800\" pathLength=\"1\"/><path class=\"t\" d=\"M285 640L600 566M295 638V698M345 626V690M395 614V681M445 602V673M495 591V664M545 579V656M595 567V647\" pathLength=\"1\"/><path class=\"m\" d=\"M855 590L1074 650V806H1000L855 662Z\" pathLength=\"1\"/><path class=\"a\" d=\"M170 214L272 700H62Z\" pathLength=\"1\"/><path class=\"t\" d=\"M166 700V760\" pathLength=\"1\"/><path class=\"a\" d=\"M910 330a90 90 0 1 0 180 0a90 90 0 1 0 -180 0\" pathLength=\"1\"/><path class=\"t\" d=\"M1000 420V600\" pathLength=\"1\"/><path class=\"q\" d=\"M320 42H935M320 28V56M935 28V56\" pathLength=\"1\"/><text x=\"627.5\" y=\"30\">17,80</text><path class=\"q\" d=\"M1048 205V600M1034 205H1062M1034 600H1062\" pathLength=\"1\"/><text x=\"1036\" y=\"402.5\" transform=\"rotate(-90 1036 402.5)\">8,40</text>" };
  DRAW.loftF = { vb: '0 0 1170 780', big: true, photo: true, d: "<path class=\"m\" d=\"M105 0H930V705H105Z\" pathLength=\"1\"/><path class=\"k\" d=\"M105 40H930M105 80H930M105 120H930M105 160H930M105 200H930M105 240H930M105 280H930M105 320H930M105 360H930M105 400H930M105 440H930M105 480H930M105 520H930M105 560H930M105 600H930M105 640H930M105 680H930\" pathLength=\"1\"/><path class=\"v\" d=\"M0 250H105V718L0 780Z\" pathLength=\"1\"/><path class=\"s\" d=\"M0 780L105 705H930L1170 780Z\" pathLength=\"1\"/><path class=\"s\" d=\"M300 250H380V705H300Z\" pathLength=\"1\"/><path class=\"m\" d=\"M405 735V390Q510 330 615 390V735Z\" pathLength=\"1\"/><path class=\"v\" d=\"M428 715V405Q510 362 592 405V715Z\" pathLength=\"1\"/><path class=\"m\" d=\"M665 358H768V458H665Z\" pathLength=\"1\"/><path class=\"m\" d=\"M788 338H880V423H788Z\" pathLength=\"1\"/><path class=\"m\" d=\"M662 585H918V718H662Z\" pathLength=\"1\"/><path class=\"k\" d=\"M662 650H918M790 585V718\" pathLength=\"1\"/><path class=\"s\" d=\"M922 310H1105V780H922Z\" pathLength=\"1\"/><path class=\"k\" d=\"M958 310V780M994 310V780M1030 310V780M1066 310V780M1102 310V780\" pathLength=\"1\"/><path class=\"t\" d=\"M925 300L1170 285\" pathLength=\"1\"/><path class=\"m\" d=\"M400 112L420 95H1000L1045 152H400Z\" pathLength=\"1\"/><path class=\"s\" d=\"M0 135L155 155V250L0 240Z\" pathLength=\"1\"/><path class=\"s\" d=\"M155 155H778V265H155Z\" pathLength=\"1\"/><path class=\"s\" d=\"M778 162H1150V250H778Z\" pathLength=\"1\"/><path class=\"t\" d=\"M100 58H1165M105 58V250M1150 58V210M240 0V150M290 0V150M690 0V150\" pathLength=\"1\"/><path class=\"t\" d=\"M327 265V277\" pathLength=\"1\"/><path class=\"v\" d=\"M309 295a18 18 0 1 0 36 0a18 18 0 1 0 -36 0\" pathLength=\"1\"/><path class=\"t\" d=\"M402 265V274\" pathLength=\"1\"/><path class=\"v\" d=\"M376 300a26 26 0 1 0 52 0a26 26 0 1 0 -52 0\" pathLength=\"1\"/><path class=\"t\" d=\"M485 265V285\" pathLength=\"1\"/><path class=\"v\" d=\"M452 318a33 33 0 1 0 66 0a33 33 0 1 0 -66 0\" pathLength=\"1\"/><path class=\"t\" d=\"M566 265V276\" pathLength=\"1\"/><path class=\"v\" d=\"M542 300a24 24 0 1 0 48 0a24 24 0 1 0 -48 0\" pathLength=\"1\"/><path class=\"t\" d=\"M643 265V276\" pathLength=\"1\"/><path class=\"v\" d=\"M626 293a17 17 0 1 0 34 0a17 17 0 1 0 -34 0\" pathLength=\"1\"/><path class=\"t\" d=\"M220 270L110 780M295 270L190 720M207 330L281 330M192 400L265 400M177 470L248 470M162 540L232 540M147 610L216 610M132 680L199 680\" pathLength=\"1\"/><path class=\"q\" d=\"M105 24H930M105 10V38M930 10V38\" pathLength=\"1\"/><text x=\"517.5\" y=\"12\">8,20</text><path class=\"q\" d=\"M1135 250V780M1121 250H1149M1121 780H1149\" pathLength=\"1\"/><text x=\"1123\" y=\"515.0\" transform=\"rotate(-90 1123 515.0)\">2,70</text>" };
  DRAW.noveF = { vb: '0 0 1277 758', big: true, photo: true, d: "<path class=\"s\" d=\"M0 25H1277V740H0Z\" pathLength=\"1\"/><path class=\"v\" d=\"M52 55H1240V720H52Z\" pathLength=\"1\"/><path class=\"s\" d=\"M500 22H777V50H500Z\" pathLength=\"1\"/><text class=\"sg\" x=\"638\" y=\"44\">NOVE</text><path class=\"m\" d=\"M465 520H895V690H465Z\" pathLength=\"1\"/><path class=\"s\" d=\"M52 695H1240V720H52Z\" pathLength=\"1\"/><path class=\"m\" d=\"M390 680H915V702H390Z\" pathLength=\"1\"/><path class=\"t\" d=\"M155 240H965\" pathLength=\"1\"/><path class=\"m\" d=\"M166 262a9 9 0 1 0 18 0a9 9 0 1 0 -18 0\" pathLength=\"1\"/><path class=\"m\" d=\"M276 262a9 9 0 1 0 18 0a9 9 0 1 0 -18 0\" pathLength=\"1\"/><path class=\"m\" d=\"M381 262a9 9 0 1 0 18 0a9 9 0 1 0 -18 0\" pathLength=\"1\"/><path class=\"m\" d=\"M431 262a9 9 0 1 0 18 0a9 9 0 1 0 -18 0\" pathLength=\"1\"/><path class=\"m\" d=\"M613 262a9 9 0 1 0 18 0a9 9 0 1 0 -18 0\" pathLength=\"1\"/><path class=\"m\" d=\"M724 262a9 9 0 1 0 18 0a9 9 0 1 0 -18 0\" pathLength=\"1\"/><path class=\"m\" d=\"M876 262a9 9 0 1 0 18 0a9 9 0 1 0 -18 0\" pathLength=\"1\"/><path class=\"m\" d=\"M931 262a9 9 0 1 0 18 0a9 9 0 1 0 -18 0\" pathLength=\"1\"/><path class=\"m\" d=\"M957 262a9 9 0 1 0 18 0a9 9 0 1 0 -18 0\" pathLength=\"1\"/><path class=\"m\" d=\"M193 395a17 17 0 1 0 34 0a17 17 0 1 0 -34 0\" pathLength=\"1\"/><path class=\"m\" d=\"M178 430H246L264 600H158Z\" pathLength=\"1\"/><path class=\"t\" d=\"M198 600V695M228 600V695\" pathLength=\"1\"/><path class=\"m\" d=\"M302 400a16 16 0 1 0 32 0a16 16 0 1 0 -32 0\" pathLength=\"1\"/><path class=\"m\" d=\"M295 435H345L352 665H286Z\" pathLength=\"1\"/><path class=\"m\" d=\"M413 386a17 17 0 1 0 34 0a17 17 0 1 0 -34 0\" pathLength=\"1\"/><path class=\"m\" d=\"M405 420H458L468 640H398Z\" pathLength=\"1\"/><path class=\"t\" d=\"M418 640V685M445 640V685\" pathLength=\"1\"/><path class=\"m\" d=\"M528 383a16 16 0 1 0 32 0a16 16 0 1 0 -32 0\" pathLength=\"1\"/><path class=\"m\" d=\"M522 415H568L582 585H506Z\" pathLength=\"1\"/><path class=\"t\" d=\"M530 585V682M560 585V682\" pathLength=\"1\"/><path class=\"m\" d=\"M839 382a16 16 0 1 0 32 0a16 16 0 1 0 -32 0\" pathLength=\"1\"/><path class=\"m\" d=\"M835 415H880L895 625H823Z\" pathLength=\"1\"/><path class=\"t\" d=\"M842 625V680M868 625V680\" pathLength=\"1\"/><path class=\"m\" d=\"M955 392a15 15 0 1 0 30 0a15 15 0 1 0 -30 0\" pathLength=\"1\"/><path class=\"m\" d=\"M935 425H1015L1012 610H932Z\" pathLength=\"1\"/><path class=\"t\" d=\"M955 610V690M985 610V690\" pathLength=\"1\"/><path class=\"m\" d=\"M1052 380a16 16 0 1 0 32 0a16 16 0 1 0 -32 0\" pathLength=\"1\"/><path class=\"m\" d=\"M1030 415H1110L1118 540H1025Z\" pathLength=\"1\"/><path class=\"t\" d=\"M1050 540V685M1090 540V685\" pathLength=\"1\"/><path class=\"t\" d=\"M652 612V470\" pathLength=\"1\"/><path class=\"a\" d=\"M600 420a68 68 0 1 0 136 0a68 68 0 1 0 -136 0\" pathLength=\"1\"/><path class=\"s\" d=\"M612 612H690L680 680H622Z\" pathLength=\"1\"/><path class=\"d\" d=\"M290 55V720M532 55V720M775 55V720M1008 55V720\" pathLength=\"1\"/><path class=\"t\" d=\"M0 748H1277\" pathLength=\"1\"/><path class=\"q\" d=\"M52 92H1240M52 78V106M1240 78V106\" pathLength=\"1\"/><text x=\"646.0\" y=\"80\">11,90</text><path class=\"q\" d=\"M1258 55V720M1244 55H1272M1244 720H1272\" pathLength=\"1\"/><text x=\"1246\" y=\"387.5\" transform=\"rotate(-90 1246 387.5)\">6,30</text>" };
  DRAW.adigeF = { vb: '0 0 1171 781', big: true, photo: true, d: "<path class=\"t\" d=\"M820 781L1020 700H1171\" pathLength=\"1\"/><path class=\"m\" d=\"M0 0L560 0L640 45L700 95L760 135L820 185L870 260L905 345L960 375L1020 425L1020 590L960 650L905 690L870 730L820 781L760 820L700 860L640 900L560 950L0 1000Z\" pathLength=\"1\"/><path class=\"v\" d=\"M0 120L560 114L640 148L700 187L760 217L820 257L870 316L905 386L960 408L1020 445L1020 456L960 427L905 411L870 349L820 298L760 265L700 240L640 207L560 180L0 190Z\" pathLength=\"1\"/><path class=\"v\" d=\"M0 320L560 304L640 319L700 340L760 354L820 376L870 410L905 455L960 463L1020 478L1020 489L960 482L905 480L870 443L820 417L760 402L700 393L640 378L560 370L0 390Z\" pathLength=\"1\"/><path class=\"v\" d=\"M0 520L560 494L640 490L700 493L760 491L820 495L870 504L905 524L960 518L1020 511L1020 522L960 537L905 549L870 537L820 537L760 539L700 546L640 549L560 560L0 590Z\" pathLength=\"1\"/><path class=\"v\" d=\"M0 720L560 684L640 661L700 646L760 628L820 614L870 598L905 593L960 573L1020 544L1020 555L960 592L905 618L870 631L820 656L760 676L700 699L640 720L560 750L0 790Z\" pathLength=\"1\"/><path class=\"k\" d=\"M0 60L560 57L640 96L700 141L760 176L820 221L870 288L905 366L960 392L1020 435M0 250L560 238L640 259L700 286L760 306L820 334L870 378L905 431L960 444L1020 466M0 450L560 428L640 430L700 439L760 443L820 453L870 472L905 500L960 499L1020 499M0 650L560 618L640 601L700 592L760 580L820 572L870 566L905 569L960 554L1020 532M0 850L560 808L640 772L700 745L760 717L820 692L870 660L905 638L960 609L1020 565\" pathLength=\"1\"/><path class=\"k\" d=\"M560 0L560 950\" pathLength=\"1\"/><path class=\"k\" d=\"M640 45L640 900\" pathLength=\"1\"/><path class=\"k\" d=\"M700 95L700 860\" pathLength=\"1\"/><path class=\"k\" d=\"M760 135L760 820\" pathLength=\"1\"/><path class=\"k\" d=\"M820 185L820 781\" pathLength=\"1\"/><path class=\"k\" d=\"M870 260L870 730\" pathLength=\"1\"/><path class=\"k\" d=\"M905 345L905 690\" pathLength=\"1\"/><path class=\"k\" d=\"M960 375L960 650\" pathLength=\"1\"/><path class=\"a\" d=\"M965 560a70 70 0 1 0 140 0a70 70 0 1 0 -140 0\" pathLength=\"1\"/><path class=\"t\" d=\"M1035 630V735\" pathLength=\"1\"/><path class=\"a\" d=\"M1077 560a48 48 0 1 0 96 0a48 48 0 1 0 -96 0\" pathLength=\"1\"/><path class=\"t\" d=\"M1125 608V700\" pathLength=\"1\"/><path class=\"q\" d=\"M0 24H560M0 10V38M560 10V38\" pathLength=\"1\"/><text x=\"280.0\" y=\"12\">48,00</text><path class=\"q\" d=\"M44 20V760M30 20H58M30 760H58\" pathLength=\"1\"/><text x=\"32\" y=\"390.0\" transform=\"rotate(-90 32 390.0)\">26,40</text>" };
  DRAW.tartaroF = { vb: '0 0 1332 749', big: true, photo: true, d: "<path class=\"s\" d=\"M445 0H1332V150L1235 188H580Z\" pathLength=\"1\"/><path class=\"s\" d=\"M430 749L580 560H1332V749Z\" pathLength=\"1\"/><path class=\"v\" d=\"M580 180H1235V460H580Z\" pathLength=\"1\"/><path class=\"a\" d=\"M625 370a55 55 0 1 0 110 0a55 55 0 1 0 -110 0\" pathLength=\"1\"/><path class=\"a\" d=\"M798 330a72 72 0 1 0 144 0a72 72 0 1 0 -144 0\" pathLength=\"1\"/><path class=\"a\" d=\"M915 280a80 80 0 1 0 160 0a80 80 0 1 0 -160 0\" pathLength=\"1\"/><path class=\"d\" d=\"M680 180V460M820 180V460M945 180V460\" pathLength=\"1\"/><path class=\"m\" d=\"M1040 290H1235V460H1040Z\" pathLength=\"1\"/><path class=\"m\" d=\"M1235 150L1332 120V749H1235Z\" pathLength=\"1\"/><path class=\"m\" d=\"M580 460H1070V548H580Z\" pathLength=\"1\"/><path class=\"d\" d=\"M650 33H840M1000 83H1175M660 128H830M980 158H1135\" pathLength=\"1\"/><path class=\"t\" d=\"M570 72H915M905 110H1210\" pathLength=\"1\"/><path class=\"s\" d=\"M0 0H420L580 215V560L0 749Z\" pathLength=\"1\"/><path class=\"d\" d=\"M25 30L555 229M25 185L555 300M25 300L555 353M25 495L555 443M25 610L555 496\" pathLength=\"1\"/><path class=\"t\" d=\"M25 0V720M300 0V660M405 0V600\" pathLength=\"1\"/><path class=\"t\" d=\"M578 250L640 540M598 250L660 540\" pathLength=\"1\"/><path class=\"m\" d=\"M615 540H965V560H615Z\" pathLength=\"1\"/><path class=\"t\" d=\"M660 560V690M900 560V700\" pathLength=\"1\"/><path class=\"m\" d=\"M440 510L520 505L560 590L610 580L600 640L470 660Z\" pathLength=\"1\"/><path class=\"t\" d=\"M830 515V700M950 515V700M830 540H950M1000 505V700M1100 505V700M1000 525H1100\" pathLength=\"1\"/><path class=\"q\" d=\"M580 222H1235M580 208V236M1235 208V236\" pathLength=\"1\"/><text x=\"907.5\" y=\"210\">14,50</text><path class=\"q\" d=\"M1292 150V749M1278 150H1306M1278 749H1306\" pathLength=\"1\"/><text x=\"1280\" y=\"449.5\" transform=\"rotate(-90 1280 449.5)\">4,80</text>" };
  DRAW.pini = { vb: '0 0 1170 780', big: true, photo: true, d: "<path class=\"t\" d=\"M160 740H1010\" pathLength=\"1\"/><path class=\"m\" d=\"M237 740V400H892V740Z\" pathLength=\"1\"/><path class=\"k\" d=\"M261 400V740M285 400V740M309 400V740M333 400V740M357 400V740M381 400V740M405 400V740M429 400V740M453 400V740M477 400V740M501 400V740M525 400V740M549 400V740M573 400V740M597 400V740M621 400V740M645 400V740M669 400V740M693 400V740M717 400V740M741 400V740M765 400V740M789 400V740M813 400V740M837 400V740M861 400V740M885 400V740\" pathLength=\"1\"/><path class=\"r\" d=\"M205 400L237 205H897L930 400Z\" pathLength=\"1\"/><path class=\"d sm\" d=\"M284 205L257 400M331 205L309 400M378 205L360 400M426 205L412 400M473 205L464 400M520 205L516 400M567 205L568 400M614 205L619 400M661 205L671 400M708 205L723 400M756 205L775 400M803 205L826 400M850 205L878 400\" pathLength=\"1\"/><path class=\"v\" d=\"M690 238H760V288H690Z\" pathLength=\"1\"/><path class=\"v\" d=\"M690 300H760V350H690Z\" pathLength=\"1\"/><path class=\"v\" d=\"M770 238H840V288H770Z\" pathLength=\"1\"/><path class=\"v\" d=\"M770 300H840V350H770Z\" pathLength=\"1\"/><path class=\"r\" d=\"M624 206V118H640V206Z\" pathLength=\"1\"/><path class=\"m\" d=\"M496 410L570 196L646 410Z\" pathLength=\"1\"/><path class=\"v\" d=\"M512 402L570 232L630 402Z\" pathLength=\"1\"/><path class=\"d\" d=\"M570 232V402M538 330H603\" pathLength=\"1\"/><path class=\"v\" d=\"M290 425H440V470H290Z\" pathLength=\"1\"/><path class=\"d\" d=\"M365 425V470\" pathLength=\"1\"/><path class=\"v\" d=\"M700 425H850V470H700Z\" pathLength=\"1\"/><path class=\"d\" d=\"M775 425V470\" pathLength=\"1\"/><path class=\"v\" d=\"M300 540H450V690H300Z\" pathLength=\"1\"/><path class=\"d\" d=\"M375 540V690\" pathLength=\"1\"/><path class=\"r\" d=\"M470 518H700V534H470Z\" pathLength=\"1\"/><path class=\"v\" d=\"M530 545H640V740H530Z\" pathLength=\"1\"/><path class=\"d\" d=\"M585 545V740\" pathLength=\"1\"/><path class=\"v\" d=\"M700 510H892V740H700Z\" pathLength=\"1\"/><path class=\"d\" d=\"M764 510V740M828 510V740\" pathLength=\"1\"/><path class=\"s\" d=\"M215 740H915V752H215Z\" pathLength=\"1\"/><path class=\"a\" d=\"M452 712a26 26 0 1 0 52 0a26 26 0 1 0 -52 0\" pathLength=\"1\"/><path class=\"a\" d=\"M918 690a40 40 0 1 0 80 0a40 40 0 1 0 -80 0\" pathLength=\"1\"/><path class=\"t\" d=\"M958 730V740\" pathLength=\"1\"/><path class=\"q\" d=\"M237 150H897M237 136V164M897 136V164\" pathLength=\"1\"/><text x=\"567\" y=\"136\">12,40</text><path class=\"q\" d=\"M1000 197V740M986 197H1014M986 740H1014\" pathLength=\"1\"/><text x=\"984\" y=\"468\" transform=\"rotate(-90 984 468)\">9,80</text>" };

  const svg = (name, label, vb) => {
    const D = DRAW[name] || '';
    const d = typeof D === 'string' ? D : D.d;
    return `<svg viewBox="${vb || D.vb || '0 0 600 340'}"${D.big ? ' class="big"' : ''}${D.photo ? ' preserveAspectRatio="xMidYMid slice"' : ''} ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>${d}</svg>`;
  };

  function inject(scope = document) {
    $$('[data-draw]', scope).forEach(el => {
      if (el.dataset.done) return;
      el.innerHTML = svg(el.dataset.draw, el.dataset.label);
      const step = el.classList.contains('hero-dw') ? 0.045 : 0.025;
      $$('path', el).forEach((p, i) => p.style.setProperty('--d', (i * step).toFixed(3) + 's'));
      el.dataset.done = '1';
    });
  }

  /* ---------------------------------------------------------
     2. DATI — progetti e tariffe del calcolatore
     --------------------------------------------------------- */
  const PROGETTI = [
    { id: 'vela', nome: 'Casa Vela', cat: 'Residenziale', luogo: 'Bardolino (VR)', anno: 2025, mq: '210 m²', draw: 'velaF', stato: 'Realizzato',
      foto: ['vela-1', 'vela-2'],
      testo: 'Una casa sulle colline sopra il lago di Garda, su due volumi sfalsati con coperture sottili che sporgono come vele e fanno ombra alle vetrate. Il soggiorno si apre tutto sul giardino e sulla piscina; rivestimenti in legno, tetti verdi, pompa di calore e fotovoltaico integrato.' },
    { id: 'valli', nome: 'Casale Le Valli', cat: 'Ristrutturazione', luogo: 'Isola della Scala (VR)', anno: 2024, mq: '340 m²', draw: 'valliF', stato: 'Realizzato',
      foto: ['valli-1', 'valli-2'],
      testo: 'Recupero di un casale in pietra abbandonato da vent’anni. Abbiamo tenuto muri e travi originali, aperto le vecchie arcate con serramenti in ferro e vetro e aggiunto un volume vetrato alto due piani. Dentro, cucina su misura sotto le travi a vista.' },
    { id: 'pini', nome: 'Casa dei Pini', cat: 'Ristrutturazione', luogo: 'Asiago (VI)', anno: 2026, mq: '180 m²', draw: 'pini', stato: 'In progetto',
      foto: ['casale-prima'], didascalia: ['Lo stato attuale, foto del sopralluogo'],
      testo: 'Una casa in legno di inizio Novecento, abbandonata da decenni ai margini del bosco. Il progetto tiene sagoma, tetto a falde e comignolo, trasforma l’abbaino in una grande vetrata a timpano e ricostruisce il portico con una copertura sottile in acciaio.' },
    { id: 'loft', nome: 'Loft Cattaneo', cat: 'Interni', luogo: 'Verona', anno: 2025, mq: '95 m²', draw: 'loftF', stato: 'Realizzato',
      foto: ['loft-1', 'loft-2'],
      testo: 'Un ex laboratorio diventato casa. Abbiamo riportato a vista i mattoni originali, costruito un soppalco in acciaio e legno per la zona notte e disegnato una cucina aperta con mensole su misura lungo la parete.' },
    { id: 'nove', nome: 'Nove Store', cat: 'Commerciale', luogo: 'Cerea (VR)', anno: 2023, mq: '120 m²', draw: 'noveF', stato: 'Realizzato',
      foto: ['nove-1', 'nove-2'],
      testo: 'Un concept store di abbigliamento e design in centro. Vetrina a tutta altezza sulla strada, e all’interno isole espositive in legno, binari luminosi a soffitto e un volume in legno che nasconde camerini e magazzino.' },
    { id: 'adige', nome: 'Sede Adige', cat: 'Commerciale', luogo: 'Legnago (VR)', anno: 2024, mq: '1.800 m²', draw: 'adigeF', stato: 'Realizzato',
      foto: ['adige-1', 'adige-2'],
      testo: 'La nuova sede di un’azienda di logistica. Una facciata ondulata a fasce colorate, che cambia aspetto a seconda di dove la guardi, e dentro open space luminosi con lunghi tavoli condivisi.' },
    { id: 'tartaro', nome: 'Padiglione Tartaro', cat: 'Pubblico', luogo: 'Nogara (VR)', anno: 2026, mq: '450 m²', draw: 'tartaroF', stato: 'In cantiere',
      foto: ['tartaro-1', 'tartaro-2'],
      testo: 'Sala civica e biblioteca lungo il fiume. Librerie a tutta altezza, pareti vetrate verso il verde e un grande lucernario circolare che porta luce naturale al centro della sala di lettura.' }
  ];

  const TIPI = {
    nuova:    { n: 'Nuova costruzione',         c: [1700, 2300, 3100], t: [10, 100], fee: .09 },
    completa: { n: 'Ristrutturazione completa', c: [850, 1250, 1800],  t: [4, 110],  fee: .09 },
    leggera:  { n: 'Ristrutturazione leggera',  c: [380, 620, 900],    t: [2, 200],  fee: .10 },
    interni:  { n: 'Interior design',           c: [240, 430, 780],    t: [1.5, 240], fee: .12 }
  };
  const FIN = ['Essenziali', 'Standard', 'Di pregio'];

  const pic = (n, alt, cls = '', sizes = '(min-width: 620px) 66vw, 100vw', lazy = true) =>
    `<img${cls ? ` class="${cls}"` : ''} src="img/${n}.webp" srcset="img/${n}-800.webp 800w, img/${n}.webp 1400w" sizes="${sizes}" alt="${alt}"${lazy ? ' loading="lazy"' : ''} decoding="async">`;

  /* ---------------------------------------------------------
     3. SCHEDE PROGETTO
     --------------------------------------------------------- */
  const card = (p, asLink) => {
    const open = asLink
      ? `<a class="card-hit" href="progetti.html#${p.id}">`
      : `<button class="card-hit" type="button" data-id="${p.id}" aria-haspopup="dialog">`;
    return `<article class="card" data-cat="${p.cat}">${open}
      <span class="card-media">
        ${pic(p.foto[0], p.nome, 'card-img')}
        <span class="card-dw dw rvd" data-draw="${p.draw}"></span>
      </span>
      <span class="card-cart">
        <span class="cc-n">${p.nome}</span><span class="cc-s">${p.stato}</span>
        <span>${p.cat}</span><span>${p.luogo}</span>
        <span>${p.anno}</span><span>${p.mq}</span>
      </span>${asLink ? '</a>' : '</button>'}</article>`;
  };

  const featured = $('#featured');
  if (featured) {
    featured.innerHTML = ['vela', 'loft', 'tartaro'].map(id => card(PROGETTI.find(p => p.id === id), true)).join('');
  }

  const grid = $('#grid');
  if (grid) {
    grid.innerHTML = PROGETTI.map(p => card(p)).join('');

    // filtri
    const flt = $('#flt');
    const cats = ['Tutti', ...new Set(PROGETTI.map(p => p.cat))];
    flt.innerHTML = cats.map((c, i) => `<button type="button" aria-pressed="${i === 0}" data-c="${c}">${c}</button>`).join('');
    flt.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      $$('button', flt).forEach(x => x.setAttribute('aria-pressed', x === b));
      grid.classList.toggle('flt-on', b.dataset.c !== 'Tutti');
      $$('.card', grid).forEach(c => { c.hidden = b.dataset.c !== 'Tutti' && c.dataset.cat !== b.dataset.c; });
    });

    // finestra dettaglio
    const dlg = $('#modal');
    const stage = $('.md-stage', dlg), thumbs = $('.md-thumbs', dlg);
    let cur = null;
    const show = i => {
      const p = cur, n = p.foto.length;
      if (i < n) {
        stage.className = 'md-stage';
        stage.innerHTML = pic(p.foto[i], `${p.nome}, foto ${i + 1}`, '', '(min-width: 760px) 60vw, 100vw', false) +
          (p.didascalia && p.didascalia[i] ? `<span class="md-cap">${p.didascalia[i]}</span>` : '');
      } else {
        stage.className = 'md-stage is-dw';
        stage.innerHTML = `${pic(p.foto[0], '', 'ghost', '(min-width: 760px) 60vw, 100vw', false)}<div class="dw rvd in">${svg(p.draw, `Prospetto di ${p.nome}`)}</div>`;
        $$('path', stage).forEach((el, k) => el.style.setProperty('--d', (k * .03).toFixed(3) + 's'));
      }
      $$('button', thumbs).forEach((b, k) => b.setAttribute('aria-pressed', k === i));
    };
    const openP = p => {
      cur = p;
      thumbs.innerHTML = p.foto.map((f, i) =>
        `<button type="button" aria-label="Foto ${i + 1}"><img src="img/${f}-800.webp" alt=""></button>`).join('') +
        `<button type="button" class="t-dw">Prospetto</button>`;
      show(root.classList.contains('bp') ? p.foto.length : 0);
      $('.md-c', dlg).textContent = p.cat;
      $('#md-t', dlg).textContent = p.nome;
      $('.md-p', dlg).textContent = p.testo;
      $('.cart', dlg).innerHTML =
        [['Luogo', p.luogo], ['Anno', p.anno], ['Superficie', p.mq], ['Stato', p.stato], ['Scala del disegno', '1:200']]
          .map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('');
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    };
    thumbs.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      show($$('button', thumbs).indexOf(b));
    });
    grid.addEventListener('click', e => {
      const b = e.target.closest('[data-id]'); if (!b) return;
      openP(PROGETTI.find(p => p.id === b.dataset.id));
    });
    $('.md-x', dlg).addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', () => { if (location.hash) history.replaceState(null, '', location.pathname); });

    const fromHash = PROGETTI.find(p => '#' + p.id === location.hash);
    if (fromHash) setTimeout(() => openP(fromHash), 350);
  }

  /* ---------------------------------------------------------
     4. PRIMA / DOPO
     --------------------------------------------------------- */
  $$('[data-compare]').forEach(el => {
    el.classList.add('cmp');
    el.innerHTML =
      `<div class="cmp-l cmp-full dw">${pic('casale-prima', '', 'cmp-ghost')}${svg('pini', 'Casa dei Pini, il progetto')}</div>
       <div class="cmp-b">${pic('casale-prima', 'Casa dei Pini oggi, foto del sopralluogo')}</div>
       <input class="sr" type="range" min="0" max="100" value="50" aria-label="Confronta la casa di oggi con il progetto">
       <span class="cmp-h" aria-hidden="true"></span>
       <span class="cmp-t cmp-t1" aria-hidden="true">Oggi</span><span class="cmp-t cmp-t2" aria-hidden="true">Progetto</span>`;
    const r = $('input', el);
    const set = v => { r.value = v; el.style.setProperty('--pos', v + '%'); };
    r.addEventListener('input', () => set(r.value));
    let drag = false;
    const move = e => {
      const b = el.getBoundingClientRect();
      set(Math.round(Math.min(100, Math.max(0, (e.clientX - b.left) / b.width * 100))));
    };
    el.addEventListener('pointerdown', e => { drag = true; el.setPointerCapture(e.pointerId); move(e); });
    el.addEventListener('pointermove', e => { if (drag) move(e); });
    ['pointerup', 'pointercancel'].forEach(t => el.addEventListener(t, () => { drag = false; }));
    set(50);
  });

  /* ---------------------------------------------------------
     5. DISEGNI + COMPARSA ALLO SCORRIMENTO
     --------------------------------------------------------- */
  inject();

  // i testi .rv sono "ritagliati" a zero, quindi si osserva il loro contenitore
  const group = new Map();
  const io = ('IntersectionObserver' in window && !RM)
    ? new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting) return;
        (group.get(e.target) || [e.target]).forEach(el => el.classList.add('in'));
        io.unobserve(e.target);
      }), { rootMargin: '0px 0px -8% 0px', threshold: .12 })
    : null;
  $$('.rvd').forEach(el => io ? io.observe(el) : el.classList.add('in'));
  $$('.rv').forEach(el => {
    if (!io) return el.classList.add('in');
    const p = el.parentElement;
    if (!group.has(p)) { group.set(p, []); io.observe(p); }
    group.get(p).push(el);
  });

  const hero = $('.hero-media');
  if (hero) {
    const done = () => hero.classList.add('done');
    if (RM) done(); else setTimeout(done, 3600);
    hero.addEventListener('click', () => { if (hero.classList.contains('done')) hero.classList.toggle('show-dw'); });
    hero.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hero.click(); } });
  }

  /* ---------------------------------------------------------
     6. MODALITÀ PROGETTO (tavola tecnica)
     --------------------------------------------------------- */
  const bpt = $('.bpt');
  const meta = $('meta[name="theme-color"]');
  const sync = () => {
    const on = root.classList.contains('bp');
    bpt && bpt.setAttribute('aria-pressed', on);
    meta && meta.setAttribute('content', on ? '#1C4A92' : '#191B1D');
  };
  sync();

  bpt && bpt.addEventListener('click', () => {
    const on = !root.classList.contains('bp');
    const apply = () => {
      root.classList.toggle('bp', on);
      sync();
      try { localStorage.setItem('linea-bp', on ? '1' : '0'); } catch (_) {}
    };
    if (RM || !document.startViewTransition) { apply(); return; }

    const b = bpt.getBoundingClientRect();
    const x = b.left + b.width / 2, y = b.top + b.height / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.classList.add('vt');
    const t = document.startViewTransition(apply);
    t.ready.then(() => root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 800, easing: 'cubic-bezier(.7,0,.2,1)', pseudoElement: '::view-transition-new(root)' }
    )).catch(() => {});
    t.finished.finally(() => root.classList.remove('vt'));
  });

  // mirino con coordinate (solo mouse, solo in modalità progetto)
  if (matchMedia('(pointer: fine)').matches) {
    const lx = $('.xh-x'), ly = $('.xh-y'), lb = $('.xh-l');
    let mx = 0, my = 0, raf = 0;
    const m = n => (n / 40).toFixed(1).replace('.', ',');
    addEventListener('pointermove', e => {
      mx = e.clientX; my = e.clientY;
      if (raf || !lx) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!root.classList.contains('bp')) return;
        lx.style.transform = `translateY(${my}px)`;
        ly.style.transform = `translateX(${mx}px)`;
        lb.style.transform = `translate(${mx + 14}px,${my + 14}px)`;
        lb.textContent = `x ${m(mx + scrollX)} m   y ${m(my + scrollY)} m`;
      });
    }, { passive: true });
  }

  /* ---------------------------------------------------------
     7. NAVIGAZIONE
     --------------------------------------------------------- */
  const here = location.pathname.split('/').pop() || 'index.html';
  $$('.nav a').forEach(a => { if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page'); });

  const burger = $('.burger'), nav = $('#nav');
  burger && burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
    nav.classList.toggle('open', open);
  });
  nav && nav.addEventListener('click', e => {
    if (e.target.closest('a') && burger) { burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }
  });

  const top = $('.top');
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    top && top.classList.toggle('sc', scrollY > 10);
    tlUpdate();
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  /* ---------------------------------------------------------
     8. LINEA DEL TEMPO DEL METODO
     --------------------------------------------------------- */
  const tl = $('.tl');
  const steps = tl ? $$('li', tl) : [];
  function tlUpdate() {
    if (!tl) return;
    const r = tl.getBoundingClientRect(), mark = innerHeight * .62;
    tl.style.setProperty('--p', Math.min(1, Math.max(0, (mark - r.top) / r.height)).toFixed(3));
    steps.forEach(s => s.classList.toggle('on', s.getBoundingClientRect().top < mark));
  }
  onScroll();

  /* ---------------------------------------------------------
     9. CALCOLATORE DELLA STIMA
     --------------------------------------------------------- */
  const calc = $('#calc');
  if (calc) {
    const eur = n => new Intl.NumberFormat('it-IT').format(Math.round(n / 1000) * 1000) + ' €';
    const upd = () => {
      const t = calc.elements.tipo.value, f = +calc.elements.fin.value, mq = +calc.elements.mq.value;
      const T = TIPI[t], base = T.c[f] * mq, mesi = T.t[0] + mq / T.t[1];
      $('#mq-o').textContent = mq + ' m²';
      $('#r-lav').textContent = `${eur(base * .88)} – ${eur(base * 1.12)}`;
      $('#r-fee').textContent = `circa ${eur(base * T.fee)}`;
      $('#r-t').textContent = `${Math.max(1, Math.floor(mesi))}–${Math.ceil(mesi * 1.3)} mesi`;
      $('#r-go').href = `contatti.html?tipo=${t}&mq=${mq}&fin=${f}`;
    };
    calc.addEventListener('input', upd);
    calc.addEventListener('submit', e => e.preventDefault());
    upd();
  }

  /* ---------------------------------------------------------
     10. MODULO CONTATTI (apre la mail già compilata)
     --------------------------------------------------------- */
  const cf = $('#cf');
  if (cf) {
    const q = new URLSearchParams(location.search), t = q.get('tipo');
    if (TIPI[t]) {
      cf.elements.tipo.value = t;
      const mq = parseInt(q.get('mq'), 10), f = FIN[+q.get('fin')];
      cf.elements.msg.value = `Vorrei un sopralluogo per: ${TIPI[t].n.toLowerCase()}` +
        (mq ? `, circa ${mq} m²` : '') + (f ? `, finiture ${f.toLowerCase()}` : '') + '.\n\n';
    }
    cf.addEventListener('submit', e => {
      e.preventDefault();
      if (!cf.reportValidity()) return;
      const v = n => cf.elements[n].value.trim();
      const tipo = cf.elements.tipo.selectedOptions[0].textContent;
      const body = `${v('msg')}\n\nNome: ${v('nome')}\nTelefono: ${v('tel') || '-'}\nEmail: ${v('email')}\nIntervento: ${tipo}`;
      location.href = `mailto:studiomenny.web@gmail.com?subject=${encodeURIComponent('Richiesta sopralluogo - ' + v('nome'))}&body=${encodeURIComponent(body)}`;
      $('.ok', cf).hidden = false;
    });
  }

  /* ---------------------------------------------------------
     11. MAPPA GOOGLE: si carica solo dopo il consenso (cookie di terze parti)
     --------------------------------------------------------- */
  const map = $('.map');
  if (map) {
    const load = () => {
      map.innerHTML = `<iframe title="Mappa dello studio a Nogara" src="https://www.google.com/maps?q=Via%20Palmino%20Sterzi%2041%2C%20Nogara%20VR&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
    };
    let ok = false;
    try { ok = localStorage.getItem('linea-maps') === '1'; } catch (_) {}
    if (ok) load();
    else $('.map-ok', map).addEventListener('click', () => {
      if ($('#map-rem', map).checked) try { localStorage.setItem('linea-maps', '1'); } catch (_) {}
      load();
    });
  }
  // revoca del consenso dalla pagina note legali
  const rev = $('#rev-maps');
  rev && rev.addEventListener('click', () => {
    try { localStorage.removeItem('linea-maps'); } catch (_) {}
    rev.textContent = 'Consenso revocato';
    rev.disabled = true;
  });

  /* anno nel piè di pagina */
  $$('[data-y]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
