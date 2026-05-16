const sequenceBindings = [
    {
        sequences: [
            ['h', 'e', 'l', 'p'],
            ['م', 'س', 'ا', 'ع', 'د', 'ه'],
            ['م', 'س', 'ا', 'ع', 'د', 'ة'],
        ],
        handler: 'secondHelpMessage',
    },
    {
        sequences: [
            ['c', 'v'],
            ['r', 'e', 's', 'u', 'm', 'e'],
            ['س', 'ي', 'ر', 'ه'],
            ['س', 'ي', 'ر', 'ة'],
        ],
        handler: 'goToResume',
    },
    {
        sequences: [['a', 'b', 'o', 'u', 't']],
        handler: 'goToAbout',
    },
    {
        sequences: [
            ['3', '0'],
            ['t', 'h', 'i', 'r', 't', 'y'],
        ],
        handler: 'goToThirty',
    },
    {
        sequences: [
            ['2', '5'],
            ['m', 'a', 'r', 'a', 't', 'h', 'o', 'n'],
        ],
        handler: 'goToNYCMarathon25',
    },
    {
        sequences: [['f'], ['خ']],
        handler: 'toggleFont',
    },
    {
        sequences: [['t'], ['ل']],
        handler: 'toggleTheme',
    },
    {
        sequences: [
            [
                'up',
                'up',
                'down',
                'down',
                'left',
                'right',
                'left',
                'right',
                'b',
                'a',
            ],
            ['i', 'd', 'd', 'q', 'd'],
            [
                'up',
                'up',
                'down',
                'down',
                'left',
                'right',
                'left',
                'right',
                'ز',
                'ش',
            ],
        ],
        handler: 'flip',
    },
];

const arrowKeyNames = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
};

const maxSequenceLength = Math.max(
    ...sequenceBindings.flatMap(({sequences}) =>
        sequences.map((sequence) => sequence.length),
    ),
);

function normalizeKey(key) {
    return arrowKeyNames[key] ?? key.toLowerCase();
}

function hasTrailingSequence(buffer, sequence) {
    if (sequence.length > buffer.length) {
        return false;
    }

    const offset = buffer.length - sequence.length;
    return sequence.every((key, index) => buffer[offset + index] === key);
}

export function createKeybindingMatcher(handlers) {
    const buffer = [];

    return (key) => {
        buffer.push(normalizeKey(key));
        while (buffer.length > maxSequenceLength) {
            buffer.shift();
        }

        for (const {sequences, handler} of sequenceBindings) {
            if (sequences.some((sequence) => hasTrailingSequence(buffer, sequence))) {
                buffer.length = 0;
                handlers[handler]?.();
                return true;
            }
        }

        return false;
    };
}
