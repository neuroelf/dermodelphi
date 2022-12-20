function h = alluvialflow(data, left_labels, right_labels, opts)
% Copyright 2018 The MathWorks, Inc. 
%
% Plot an alluvial flow diagram.
% left_labels:  Names of categories to flow from.
% right_labels: Names of categories to flow to.
% data:         Matrix with size numel(left_labels) rows by
%               numel(right_labels) columns.
%
% Ideas for future work:
% 1. Get data from a MATLAB table, use table variable names and named rows
%    as labels.
% 2. Interface similar to the plot function, with name-value pairs, optional
%    parameters etc.

% inputs
if isa(data, 'double')
    data = {data};
end
if nargin < 3 || ~iscell(data) || isempty(data) || ...
   ~isa(data{1}, 'double') || ~ismatrix(data{1}) || ...
    any(isinf(data{1}(:)) | isnan(data{1}(:)) | data{1}(:) < 0) || ...
   ~iscell(left_labels) || numel(left_labels) ~= size(data{1}, 1) || ...
   ~iscell(right_labels) || numel(right_labels) ~= size(data{end}, 2)
    error('alluvialflow:error', 'Missing or incorrect input.');
end
data_sum = sum(data{1}(:));
for dc = 2:numel(data)
    if ~isa(data{dc}, 'double') || ~ismatrix(data{dc}) || ...
        any(isinf(data{dc}(:)) | isnan(data{dc}(:)) | data{dc}(:) < 0)
        error('alluvialflow:error', 'Missing or incorrect input.');
    end
    data_sum = max([data_sum, sum(data{dc}(:))]);
end

% options
if nargin < 4 || ~isstruct(opts) || numel(opts) ~= 1
    opts = struct;
end
if ~isfield(opts, 'barsize') || ~isa(opts.barsize, 'double') || ...
    numel(opts.barsize) ~= 1 || opts.barsize < 1
    opts.barsize = 4;
end
if ~isfield(opts, 'datasize') || ~isa(opts.datasize, 'double') || ...
    numel(opts.datasize) ~= 1 || opts.datasize < data_sum
    opts.datasize = [];
end
if ~isfield(opts, 'edgefactor') || ~isa(opts.edgefactor, 'double') || ...
    numel(opts.edgefactor) ~= 1 || opts.edgefactor < 0 || opts.edgefactor > 1
    opts.edgefactor = 0.5;
end
if ~isfield(opts, 'facealpha') || ~isa(opts.facealpha, 'double') || ...
    numel(opts.facealpha) ~= 1 || opts.facealpha > 1
    opts.facealpha = 0.4;
end
if ~isfield(opts, 'fontsize') || ~isa(opts.fontsize, 'double') || ...
    numel(opts.fontsize) ~= 1
    opts.fontsize = 16;
end
if ~isfield(opts, 'labelrotation') || ~isa(opts.labelrotation, 'double') || ...
    numel(opts.labelrotation) ~= 1
    opts.labelrotation = 90;
end
if ~isfield(opts, 'leftpoints') || ~isa(opts.leftpoints, 'double') || ...
    numel(opts.leftpoints) ~= size(data{1}, 1) || ...
    any(isinf(opts.leftpoints(:)) | isnan(opts.leftpoints(:))) || ...
    any(diff(opts.leftpoints(:)) <= 0)
    opts.leftpoints = [];
else
    opts.leftpoints = opts.leftpoints(:)';
end
if ~isfield(opts, 'patchcolors') || ~isa(opts.patchcolors, 'double') || ...
    any(opts.patchcolors(:) < 0 | opts.patchcolors(:) > 1) || ...
    size(opts.patchcolors, 2) ~= 3
    opts.patchcolors = [];
end
if ~isfield(opts, 'rightpoints') || ~isa(opts.rightpoints, 'double') || ...
    numel(opts.rightpoints) ~= size(data{end}, 2) || ...
    any(isinf(opts.rightpoints(:)) | isnan(opts.rightpoints(:))) || ...
    any(diff(opts.rightpoints(:)) <= 0)
    opts.rightpoints = [];
else
    opts.rightpoints = opts.rightpoints(:)';
end
if ~isfield(opts, 'title') || ~ischar(opts.title)
    opts.title = 'Alluvial plot';
end
if ~isfield(opts, 'whitespaces') || ~islogical(opts.whitespaces) || ...
    numel(opts.whitespaces) ~= 1
    opts.whitespaces = false;
end

% create new figure
h = figure;
h.Color = [1, 1, 1];
h.Position(3:4) = [960, 800];

% adapt data_sum if necessary
if ~isempty(opts.leftpoints)
    for dc = 1:numel(data)
        data_sum = max([data_sum, opts.leftpoints(end) + sum(data{dc}(end, :))]);
    end
end
if ~isempty(opts.rightpoints)
    for dc = 1:numel(data)
        data_sum = max([data_sum, opts.rightpoints(end) + sum(data{dc}(:, end))]);
    end
end
if ~isempty(opts.datasize)
    data_sum = opts.datasize;
end

% Find axis dimensions and set them
total_gap = 0.10 * data_sum;
if ~isempty(opts.datasize)
    data_sum = opts.datasize;
    y_height = data_sum;
else
    y_height = data_sum + total_gap;
end
x_left = 0;
x_right = numel(data);
axis([x_left, x_right, 0, y_height]) % Set limits
axis ij % origin is top left
axis off
    
% grid minor % DBG    
hold on
patch([0 0 numel(data) numel(data)], [0 y_height y_height 0], 'w');

% Color selection
if isempty(opts.patchcolors)
    patch_colors = [ ...
        .5 .5 .5; ...
        1  0  0; ...
        0  1  0; ...
        0  0  1; ...
        .5 .5  0; ...
        0 .5 .5; ...
        .5  0 .5];
else
    patch_colors = opts.patchcolors;
end
num_colors = size(patch_colors, 1);

% iterate over matrices
for dc = 1:numel(data)
    do = dc - 1;

    % compute gap sizes
    left_gap_size = total_gap / (size(data{dc}, 1) - 1);
    right_gap_size = total_gap / (size(data{dc}, 2) - 1);
    
    % Plot left categories - one per row
    left_category_sizes = sum(data{dc}, 2)';

    % These are the top points for each left category, with gaps added.
    if numel(opts.leftpoints) == size(data{dc}, 1)
        left_category_points = opts.leftpoints;
    else
        left_category_points = [0 cumsum(left_category_sizes)] + ...
            (0:numel(left_category_sizes)) .* left_gap_size;
        left_category_points(end) = [];
    end

    % plot left category bars
    plot(do + zeros(2, numel(left_category_points)), ...
        [left_category_points; (left_category_points + left_category_sizes)], ...
        'k', 'LineWidth', opts.barsize);

    % Plot right categories - one per column
    right_category_sizes = sum(data{dc}, 1);

    % These are the top points for each right category, with gaps added.
    if numel(opts.rightpoints) == size(data{dc}, 2)
        right_category_points = opts.rightpoints;
    else
        right_category_points = [0 cumsum(right_category_sizes)] + ...
            (0:numel(right_category_sizes)) .* right_gap_size;
        right_category_points(end) = [];
    end

    % plot right category bars
    plot(do + ones(2, numel(right_category_points)), ...
        [right_category_points; (right_category_points + right_category_sizes)], ...
        'k', 'LineWidth', opts.barsize);

    % Start at the beginning of each right category and stack as we go.
    right_columns_so_far = right_category_points(1:end);
    patches_per_left_category = size(data{dc}, 2);

    % iterate over rows
    for k_left = 1:size(data{dc}, 1)
        color = patch_colors(mod(k_left-1,num_colors)+1, :);
        %ecolor = opts.edgefactor .* color;

        %
        % Calculate the coordinates for all the patches split by the
        % current left category
        %

        % Split the left category
        left_patch_points = [0 cumsum(data{dc}(k_left, :))] + left_category_points(k_left);
        patch_top_lefts = left_patch_points(1:end-1);
        patch_bottom_lefts = left_patch_points(2:end);

        % Compute and stack up slice of each right category
        patch_top_rights = right_columns_so_far;
        patch_bottom_rights = patch_top_rights + data{dc}(k_left, :);
        right_columns_so_far = patch_bottom_rights;

        %
        % Plot the patches
        %

        % X coordinates of patch corners
        [bottom_curves_x, bottom_curves_y] = get_curves(0.1, patch_bottom_lefts, 0.9, patch_bottom_rights);
        [top_curves_x,    top_curves_y]    = get_curves(0.9, patch_top_rights,   0.1, patch_top_lefts);        
        X = [ ...
            repmat([0; 0], 1, patches_per_left_category); % Top left, bottom left
            bottom_curves_x;
            repmat([1; 1], 1, patches_per_left_category); % Bottom right, top right
            top_curves_x
            ];


        % Y coordinates of patch corners
        Y = [ ...
            patch_top_lefts; 
            patch_bottom_lefts; 
            bottom_curves_y;
            patch_bottom_rights; 
            patch_top_rights; 
            top_curves_y
            ];

        patch('XData', X + do, 'YData', Y, 'FaceColor', color, ...
            'FaceAlpha', opts.facealpha, 'EdgeColor', 'none');
    end
end

% horizontal lines
if ~isempty(opts.hlines)
    for l = opts.hlines
        plot([0; numel(data)], [l, l], ':', 'Color', [0.5, 0.5, 0.5], 'LineWidth', 1);
    end
end

% Place left labels
left_category_sizes = sum(data{1}, 2)';

% These are the top points for each left category, with gaps added.
if numel(opts.leftpoints) == size(data{1}, 1)
    left_category_points = opts.leftpoints;
else
    left_category_points = [0 cumsum(left_category_sizes)] + ...
        (0:numel(left_category_sizes)) .* left_gap_size;
    left_category_points(end) = [];
end
text(zeros(1, size(data{1}, 1)) - numel(data) * 0.04, ...
     left_category_points + left_category_sizes./2, ...
     left_labels, 'FontSize', opts.fontsize, ...
     'HorizontalAlignment', 'center', 'VerticalAlignment', 'middle', ...
     'Rotation', opts.labelrotation);

% Place right labels
text(numel(data) .* ones(1, size(data{end}, 2)) + numel(data) * 0.04, ...
     right_category_points + right_category_sizes./2, ...
     right_labels, 'FontSize', opts.fontsize, ...
     'HorizontalAlignment', 'center', 'VerticalAlignment', 'middle', ...
     'Rotation', opts.labelrotation);

title(opts.title, 'FontSize', round(1.5 * opts.fontsize));
end % alluvialflow


function [x, y] = get_curves(x1, y1, x2, y2)
% x1, x2: scalar x coordinates of line start, end
% y1, y2: vectors of y coordinates of line start/ends
    Npoints = 60;
    t = linspace(0, pi, Npoints);
    c = (1-cos(t))./2; % Normalized curve
    
    Ncurves = numel(y1);
	% Starting R2016b, the following line could be written simply as:
    %   y = y1 + (y2 - y1) .* c';
    y = repmat(y1, Npoints, 1) + repmat(y2 - y1, Npoints,1) .* repmat(c', 1, Ncurves);
    x = repmat(linspace(x1, x2, Npoints)', 1, Ncurves);
end  % get_curve