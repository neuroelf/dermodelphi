% read content
[num, lab, all] = xlsread('Diagnosis_mapper_source_paths.xlsx');

% get broad category rows
c1 = find(num(:, 1) == 1);
c2 = find(num(:, 1) == 3);
c3 = find(num(:, 1) == 2);

% find rows that exited, entered, were edited (at any stage)
exited = find(~isnan(num(:, 7)));
entered = find(~isnan(num(:, 8)));
edited = find(~isnan(num(:, 9)) & isnan(num(:, 7)) & isnan(num(:, 8)));
ex1 = exited(num(exited, 7) == 1);
ex2 = exited(num(exited, 7) == 2);
ex3 = exited(num(exited, 7) == 3);
en1 = entered(num(entered, 8) == 1);
en2 = entered(num(entered, 8) == 2);
en3 = entered(num(entered, 8) == 3);

% unchanged in any way
changed = sort([exited; entered; edited]);
uc1 = setdiff(c1, changed);
uc2 = setdiff(c2, changed);
uc3 = setdiff(c3, changed);

% create labels
left_labels = { ...
    'Benign', ...
    'Inter', ...
    'Malign', ...
    'Enter 1', ...
    'Enter 2'
};
left_colors = [ ...
    0.3, 0.9, 0.4; ... % benign
    0.9, 0.6, 0.1; ... % inter
    0.9, 0.2, 0.2; ... % malignant
    0.2, 0.2, 0.5; ... % enter 1
    0.4, 0.4, 0.8  ... % enter 2
    ];
right_labels = { ...
    'B OK', ...
    'B ed', ...
    'B add', ...
    'I OK', ...
    'I ed.', ...
    'I add', ...
    'M OK', ...
    'M ed.', ...
    'M add', ...
    'Exit 1', ...
    'Exit 2', ...
    'Exit 3' ...
};

% data matrix
data = zeros(5, 12);
data(1, 1) = numel(uc1);
data(1, 2) = numel(intersect(c1, edited));
data(1, 10) = numel(intersect(c1, ex1));
data(1, 11) = numel(intersect(c1, ex2));
data(1, 12) = numel(intersect(c1, ex3));
data(2, 4) = numel(uc2);
data(2, 5) = numel(intersect(c2, edited));
data(2, 10) = numel(intersect(c2, ex1));
data(2, 11) = numel(intersect(c2, ex2));
data(2, 12) = numel(intersect(c2, ex3));
data(3, 7) = numel(uc3);
data(3, 8) = numel(intersect(c3, edited));
data(3, 10) = numel(intersect(c3, ex1));
data(3, 11) = numel(intersect(c3, ex2));
data(3, 12) = numel(intersect(c3, ex3));
data(4, 3) = numel(intersect(c1, en1));
data(4, 6) = numel(intersect(c2, en1));
data(4, 9) = numel(intersect(c3, en1));
data(5, 3) = numel(intersect(c1, en2));
data(5, 6) = numel(intersect(c2, en2));
data(5, 9) = numel(intersect(c3, en2));

% plot
f = alluvialflow(data, left_labels, right_labels, ...
    struct('labelrotation', 45, 'patchcolors', left_colors));
