function delphi_charts

% use neuroelf
n = neuroelf;

% read content
[~, lab, all] = xlsread('Diagnosis_mapper_source_final2_with_paths.xlsx');
lhead = lab(1, :);
lab(1, :) = [];
all(1, :) = [];
col_la = find(strcmpi(lhead, 'levela'));
col_lb = find(strcmpi(lhead, 'levelb (category)'));
col_lc = find(strcmpi(lhead, 'levelc (diagnosis name)'));
col_ex = find(strcmpi(lhead, 'exit'));

% level A colors
acols = [128, 255, 144; 255, 128, 128; 224, 176, 128];
%boxw = 800;
%maxw = 720;
boxw = 1486;
maxw = 1440;

% iterate over LevelA terms
la = find(~cellfun('isempty', lab(:, col_la)));
la_e = [la(2:end)-1; size(lab, 1)];
for ac = 1:numel(la)
    
    % iterate over LevelB terms
    laba = lab(la(ac):la_e(ac), :);
    alla = all(la(ac):la_e(ac), :);
    lb = find(~cellfun('isempty', laba(:, col_lb)));
    lb_e = [lb(2:end)-1; size(laba, 1)];
    
    % boxes
    boxes = cell(numel(lb), 1);
    for bc = 1:numel(lb)

        % create text for header
        labb = laba{lb(bc), col_lb};
        labb(labb == char(8211)) = '-';
        htext = n.image_font(labb, '', 72, struct( ...
            'bcolor', acols(ac, :)));
        if size(htext, 2) > (maxw - 10)
            htext = n.image_font(labb, '', floor(72 * maxw / size(htext, 2)), struct( ...
                'bcolor', acols(ac, :)));
        end

        % process terms
        lc = lb(bc):lb_e(bc);
        lc(~isnan(cat(1, alla{lc, col_ex}))) = [];
        if isempty(lc)
            continue;
        end
        itexts = cell(numel(lc), 1);
        for cc = 1:numel(lc)
            itexts{cc} = set_text(n, laba{lc(cc), col_lc}, 56, acols(ac, :), maxw);
        end
        [itexth, itextw, ~] = cellfun(@size, itexts);
        itexth = 2 * numel(itexts) + sum(itexth); 
        itextw = max([size(htext, 2), max(itextw)]);
        
        % set into box
        box = uint8(0);
        box(round(1.5 * size(htext, 1)) + itexth, itextw, 3) = 0;
        box(:, :, 1) = acols(ac, 1);
        box(:, :, 2) = acols(ac, 2);
        box(:, :, 3) = acols(ac, 3);
        box(1:size(htext, 1), 1:size(htext, 2), :) = htext;
        by = round(1.4 * size(htext, 1));
        for cc = 1:numel(lc)
            box(by:by+size(itexts{cc},1)-1, 1:size(itexts{cc},2), :) = itexts{cc};
            by = by + size(itexts{cc}, 1) + 3;
        end
        boxes{bc} = box;
        %imwrite(box, sprintf('boxes/b_%d_%02d.png', ac, bc));
    end
    boxes(cellfun('isempty', boxes)) = [];
    
    % combine
    box = combine_boxes(boxes, boxw, acols(ac, :), 4);
    imwrite(box, sprintf('boxes/b_%d.png', ac));
end

% sub function to set a single text
function ti = set_text(n, t, fs, bcol, maxw)

ti = n.image_font(t, '', fs, struct('bcolor', bcol));
if size(ti, 2) <= maxw
    return;
end

% try to push parentheses into next row
tf = find(t == '(');
if ~isempty(tf)
    tt = {t(1:tf(1)-1); ['    ' t(tf(1):end)]};
    ti = n.image_font(tt, '', [fs; fs - 4], struct('bcolor', bcol, 'halign', 'left', 'tablines', 'none'));
    if size(ti, 2) <= maxw
        return;
    end
end

% try to push last comma into next row
tf = find(t == ',');
if ~isempty(tf)
    tt = {t(1:tf(end)); ['   ' t(tf(end)+1:end)]};
    ti = n.image_font(tt, '', fs, struct('bcolor', bcol, 'halign', 'left', 'tablines', 'none'));
    if size(ti, 2) <= maxw
        return;
    end
    if numel(tf) > 1
        tt = {t(1:tf(end-1)); ['   ' t(tf(end-1)+1:end)]};
        ti = n.image_font(tt, '', fs, struct('bcolor', bcol, 'halign', 'left', 'tablines', 'none'));
        if size(ti, 2) <= maxw
            return;
        end
    end
end

% split roughly in the middle
tf = find(t == ' ');
tf = tf(round(0.5 * numel(tf)));
tt = {t(1:tf-1); ['   ' t(tf+1:end)]};
ti = n.image_font(tt, '', fs, struct('bcolor', bcol, 'halign', 'left', 'tablines', 'none'));
if size(ti, 2) <= maxw
    return;
end

disp('ouch!')


% combine boxes
function box = combine_boxes(boxes, boxw, acol, cs)

% get box heights
[boxh, boxws, ~] = cellfun(@size, boxes);

% compute total height
toth = sum(boxh);

% consider best split
if isempty(cs)
    sr = zeros(numel(boxh), 1);
    sr(1) = toth / boxw;
    for s = 2:numel(sr)
        maxh = ceil(toth / s) + round(mean(boxh) / (s-1));
        tmaxh = max([maxh, max(boxh)]);
        cc = 1;
        rc = 1;
        for bc = 1:numel(boxes)
            if (rc + boxh(bc) - 1) > maxh
                cc = cc + 1;
                if rc > 1
                    rc = boxh(bc) + 1;
                else
                    rc = 1;
                end
            else
                rc = rc + boxh(bc);
            end
        end
        sr(s) = tmaxh / (cc * boxw);
        if sr(s) <= 0.25
            break;
        end
    end

    % locate best number of columns
    bs = find(sr < 1 & sr > 0.7);
    if numel(bs) > 1
        bs2 = find(sr < 0.9 & sr > 0.75);
        if isempty(bs2)
            bs = bs(2);
        else
            bs = bs2(1);
        end
    elseif isempty(bs)
        bs = find(sr < 1 & sr > 0.5);
        if isempty(bs)
            bs = find(sr < 1 & sr > 0.4);
            if isempty(bs)
                bs = find(sr < 1.2 & sr > 0.333);
            end
        end
    end
    cs = bs(1);
end

% generate box
maxh = ceil(toth / cs) + round(1.333 * mean(boxh) / (cs-1));
tmaxh = max([maxh, max(boxh)]) + 6 * (ceil(2 + numel(boxes) / cs));
box = uint8(0);
box(tmaxh, cs * (boxw + 12) + 6, 3) = 0;
box(:, :, 1) = acol(1);
box(:, :, 2) = acol(2);
box(:, :, 3) = acol(3);
box(:, 1:5, :) = 0;
box(1:5, :, :) = 0;
box(:, end-4:end, :) = 0;
box(end-4:end, :, :) = 0;
cc = 1;
bc = 1;
while bc <= numel(boxes)
    box(:, cc:cc+2, :) = 0;
    cc = cc + 8;
    rc = 1;
    tbc = numel(boxes);
    for sbc = bc:numel(boxes)
        tbh = sum(boxh(bc:sbc)) + (sbc - bc) * 6;
        if (tbh + 6) > tmaxh
            tbc = sbc - 1;
            break;
        end
    end
    tbh = sum(boxh(bc:tbc)) + (tbc - bc) * 6;
    bhx = floor((1 + tmaxh - tbh) / numel(bc:tbc));
    for sbc = bc:tbc
        box(rc:rc+4, cc:cc+boxw-1, :) = 0;
        rc = rc + 6;
        box(rc:rc+boxh(sbc)-1, cc:cc+boxws(sbc)-1, :) = boxes{sbc};
        rc = rc + boxh(sbc) + bhx;
    end
    bc = tbc + 1;
    cc = cc + boxw;
end
