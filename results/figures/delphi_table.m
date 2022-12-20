function delphi_table(tfile, style)
% delphi_table  Create tabular HTML file from paths analysis XLSX file.
%
% delphi_table  creates the file 'delphi_table.html' with compact style.
%
% delphi_table(TABLE_FILE) creates the named file with compact style.
%
% delphi_table(TABLE_FILE, STYLE) creates the named file with the specified
%    style; available options are 'compact' (default), 'edits', or 'full'.

if nargin < 1 || ~ischar(tfile) || isempty(tfile)
    tfile = 'delphi_table.html';
else
    tfile = tfile(:)';
end
if nargin < 2 || ~ischar(style) || isempty(style) || ~any(lower(style(1)) == 'cef')
    style = 'c';
else
    style = lower(style(1));
end

% read content
[~, lab, all] = xlsread('Diagnosis_mapper_source_final2_with_paths.xlsx');
lhead = lab(1, :);
lab(1, :) = [];
all(1, :) = [];
col = struct;
col.la = find(strcmpi(lhead, 'levela'));
col.lb = find(strcmpi(lhead, 'levelb (category)'));
col.lc = find(strcmpi(lhead, 'levelc (diagnosis name)'));
col.syn = find(strcmpi(lhead, 'synonyms'));
col.mod1 = find(strcmpi(lhead, 'modifier1'));
col.mod2 = find(strcmpi(lhead, 'modifier2'));
col.ex = find(strcmpi(lhead, 'exit'));
col.add = find(strcmpi(lhead, 'enter'));
col.edit = find(strcmpi(lhead, 'edit'));
col.edc = find(strcmpi(lhead, 'editcomments'));

% process rows
cells = repmat({''}, size(lab, 1), 1);
for rc = 1:numel(cells)
    cells{rc} = formatrow(all(rc, :), col, style);
end

% header and compilation
xhead = '';
if style ~= 'c'
    xhead = ['<td width="24">&nbsp;Round&nbsp;1&nbsp;&nbsp;</td>', ...
        '<td width="24">&nbsp;Round&nbsp;2&nbsp;&nbsp;</td>', ...
        '<td width="24">&nbsp;Round&nbsp;3&nbsp;&nbsp;</td>'];
end
html = ['<html><head><title>IDDx Delphi Table</title>', ...
    '<style>', ...
    'td{font: 18px serif; text-indent: -36px; padding-left: 36px; line-height: 1.5;} ', ...
    '.supercat{font: 30px serif;} ', ...
    '.category{font: 24px serif;} ', ...
    '.deletedt{color: #CC3333; text-decoration: line-through;} ', ...
    '.roundtd{border-left: solid; text-align: center;} ', ...
    '</style></head>', ...
    '<body bgcolor="#FFFFFF"><table border=0>', ...
    '<tr><td width="24">&nbsp;&nbsp;&nbsp;&nbsp;</td>', ...
    '<td width="32">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>', ...
    '<td><h2>IDDx Diagnosis Terms <small>(with synonyms/modifiers)</small></h2></td>', ...
    xhead, '</tr>', ...
    cells{:}, '</table></body></html>'];

fid = fopen(tfile, 'w');
fwrite(fid, uint8(double(html)), 'uint8');
fclose(fid);


function rc = formatrow(r, col, style)
cs = 0;
fc = '';
fcc = '';
sct = '';
ct = '';
tc = '';
syns = '';
mods = '';
mod2 = '';
edc = '';
rd = struct;
rd.r1 = '';
rd.r2 = '';
rd.r3 = '';
if isempty(r{col.la}) || (isa(r{col.la}, 'double') && isnan(r{col.la}))
    sct = '<td>&nbsp;</td>';
    if isempty(r{col.lb}) || (isa(r{col.lb}, 'double') && isnan(r{col.lb}))
        if style == 'c' && ~isnan(r{col.ex})
            rc = '';
            return;
        end
        ct = sct;
        t = deblank(r{col.lc});
        if style ~= 'c'
            rtok = '';
            rd.r1 = '<td class="roundtd">&nbsp;</td>';
            rd.r2 = '<td class="roundtd">&nbsp;</td>';
            rd.r3 = '<td class="roundtd">&nbsp;</td>';
            if ~isnan(r{col.ex})
                rtoi = r{col.ex};
                rtok = 'deleted';
                fc = '<span class="deletedt">';
            elseif ~isnan(r{col.add})
                rtoi = r{col.add};
                rtok = 'added';
            elseif ~isnan(r{col.edit})
                rtoi = r{col.edit};
                rtok = 'edited';
            elseif style == 'e'
                rc = '';
                return;
            end
            if ~isempty(rtok)
                rd.(sprintf('r%d', rtoi)) = ['<td class="roundtd"><b>' rtok '</b></td>'];
            end
            if ischar(r{col.edc}) && ~isempty(r{col.edc})
                edc = ['<br><small><font color="#FF0000"><b>Edits: </b></font>' deblank(r{col.edc})];
            end
        end
        if ~isempty(r{col.syn}) && ischar(r{col.syn})
            syns = deblank(r{col.syn});
            synss = '';
            if any(syns == ';')
                synss = 's';
            end
            syns = ['<br /><small><b>Synonym' synss ': </b>' syns '</small>'];
        end
        if ~isempty(r{col.mod1}) && ischar(r{col.mod1})
            mods = deblank(r{col.mod1});
            modss = '';
            if ~isempty(r{col.mod2}) && ischar(r{col.mod2})
                mod2 = ['" <b><i>and</i></b> "' deblank(r{col.mod2})];
                modss = 's';
            end
            mods = ['<br /><small><b><i>Modifier' modss ': </i></b>"' mods mod2 '"</small>'];
        end
    else
        cs = 2;
        tc = ' style="border-bottom: solid; padding-top: 16px;"';
        fc = '<span class="category">';
        t = r{col.lb};
    end
else
    cs = 3;
    tc = ' style="border-bottom: thick double; padding-top: 24px;"';
    fc = '<span class="supercat">';
    t = r{col.la};
end
if ~isempty(fc)
    fcc = '</span>';
end
if cs > 0
    if style ~= 'c'
        cs = cs + 3;
    end
    cs = sprintf(' colspan="%d"', cs);
else
    cs = '';
end
rc = ['<tr>' sct, ct, '<td' tc cs '>' fc t fcc syns mods edc '</td>' rd.r1 rd.r2 rd.r3 '</tr>'];
if isempty(sct)
    r{col.la} = '';
    rc = [rc, formatrow(r, col, style)];
elseif isempty(ct)
    r{col.lb} = '';
    rc = [rc, formatrow(r, col, style)];
end
