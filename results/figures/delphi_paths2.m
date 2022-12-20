% Indeterminate LAST
% - create regular table (formatable)
% - create HISTORY table (formatable, + 3 columns for 1., 2., 3. phase with
%   "a", "e", "r" (add, edit, remove)
% - 


% create labels
left_labels = { ...
    'Benign', ...
    'Malign.', ...
    'Indet.', ...
    'New'
};
left_colors = [ ...
    0.1, 0.9, 0.3; ... % benign
    0.9, 0.1, 0.1; ... % malignant
    0.9, 0.5, 0.1; ... % indeterminate
    0.1, 0.2, 0.6  ... % added
    ];
% right_labels = { ...
%     'Benign', ...
%     ' ', ...
%     'Inter', ...
%     ' ', ...
%     'Malign', ...
%     ' ', ...
%     'Out' ...
% };
right_labels = { ...
    'Benign', ...
    'Malign.', ...
    'Indet.', ...
    'Out' ...
};

% raw data
b0 = 226;
b0x = 27;
b0a = 15;
b0e = 5;
b1 = b0 - b0x + b0a;
b1x = 2;
b1a = 2;
b1e = 3;
b2 = b1 - b1x + b1a;
b2x = 4;
b2a = 0;
b2e = 1;
b3 = b2 - b2x + b2a;
i0 = 13;
i0x = 1;
i0a = 0;
i0e = 8;
i1 = i0 - i0x + i0a;
i1x = 2;
i1a = 0;
mi1 = 8;
i1e = 0;
i2 = i1 - i1x + i1a + mi1;
i2x = 0;
i2a = 0;
i2e = 1;
i3 = i2 - i2x + i2a;
m0 = 140;
m0x = 2;
m0a = 7;
m0e = 0;
m1 = m0 - m0x + m0a;
m1x = 3;
m1a = 0;
m1e = 2;
m2 = m1 - m1x + m1a - mi1;
m2x = 0;
m2a = 0;
m2e = 1;
m3 = m2 - m2x + m2a;

% data matrix
% data1 = zeros(4, 7);
data1 = zeros(4, 4);
data2 = data1;
data3 = data1;
% data1(1, 1) = b0 - (b0x + b0e);
% data1(1, 2) = b0e;
% data1(1, 7) = b0x;
data1(1, 1) = b0 - b0x;
data1(1, 4) = b0x;
% data1(2, 3) = i0 - (i0x + i0e);
% data1(2, 4) = i0e;
% data1(2, 7) = i0x;
data1(3, 3) = i0 - i0x;
data1(3, 4) = i0x;
% data1(3, 5) = m0 - (m0x + m0e);
% data1(3, 6) = m0e;
% data1(3, 7) = m0x;
data1(2, 2) = m0 - m0x;
data1(2, 4) = m0x;
% data1(4, 2) = b0a;
% data1(4, 4) = i0a;
% data1(4, 6) = m0a;
data1(4, 1) = b0a;
data1(4, 2) = m0a;
data1(4, 3) = i0a;
% data2(1, 1) = b1 - (b1x + b1e);
% data2(1, 2) = b1e;
% data2(1, 7) = b1x;
data2(1, 1) = b1 - b1x;
data2(1, 4) = b1x;
% data2(2, 3) = i1 - (i1x + i1e);
% data2(2, 4) = i1e;
% data2(2, 7) = i1x;
data2(3, 3) = i1 - i1x;
data2(3, 4) = i1x;
% data2(3, 4) = mi1;
% data2(3, 5) = m1 - (m1x + m1e + mi1);
% data2(3, 6) = m1e;
% data2(3, 7) = m1x;
data2(2, 2) = m1 - (m1x + mi1);
data2(2, 3) = data2(3, 2) + mi1;
data2(2, 4) = m1x;
% data2(4, 2) = b1a;
% data2(4, 4) = i1a;
% data2(4, 6) = m1a;
data2(4, 1) = b1a;
data2(4, 2) = m1a;
data2(4, 3) = i1a;
% data3(1, 1) = b2 - (b2x + b2e);
% data3(1, 2) = b2e;
% data3(1, 7) = b2x;
data3(1, 1) = b2 - b2x;
data3(1, 4) = b2x;
% data3(2, 3) = i2 - (i2x + i2e);
% data3(2, 4) = i2e;
% data3(2, 7) = i2x;
data3(3, 3) = i2 - i2x;
data3(3, 4) = i2x;
% data3(3, 5) = m2 - (m2x + m2e);
% data3(3, 6) = m2e;
% data3(3, 7) = m2x;
data3(2, 2) = m2 - m2x;
data3(2, 4) = m2x;
% data3(4, 2) = b2a;
% data3(4, 4) = i2a;
% data3(4, 6) = m2a;
data3(4, 1) = b2a;
data3(4, 2) = m2a;
data3(4, 3) = i2a;

% plot
leftpoints = [0, 275, 450, 500];
% rightpoints = [0, 220, 275, 290, 325, 475, 550];
rightpoints = [0, 275, 450, 550];
f = alluvialflow({data1, data2, data3}, left_labels, right_labels, ...
    struct('labelrotation', 0, 'patchcolors', left_colors, ...
        'datasize', 590, 'leftpoints', leftpoints, ...
        'rightpoints', rightpoints, ...
        'hlines', [0, 255, 430, 490, 535]));
