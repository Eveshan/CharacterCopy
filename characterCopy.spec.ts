import each from 'jest-each'

describe('CharacterCopy', () => {

    it('Given source contains one character before new line, should write to destination with one character', () => {

        // Assert
        const source = getFakeSource(['a', '\n']);
        const destination = getFakeDestination();
        const copier = createSUT(source, destination);

        // Act
        copier.Copy();

        // Assert
        expect(copier.destination.writeChar).toHaveBeenCalledWith('a');
    });

    each([[['a', 'b', 'c', '\n'],['a', 'b', 'c', 'e', '\n'],['a', 'b', 'c', 'e', 'f', '\n']]])
    .it('Given source contains multiple characters before new line, should write to destination with all characters until new line', (sourceDate) => {

        // Assert
        const source = getFakeSource(sourceDate);
        const destination = getFakeDestination();
        const copier = createSUT(source, destination);

        // Act
        copier.Copy();

        // Assert
        expect(copier.destination.writeChar).toBeCalledWith('a');
        expect(copier.destination.writeChar).toBeCalledWith('b');
        expect(copier.destination.writeChar).toBeCalledWith('c');
        expect(copier.destination.writeChar).not.toBeCalledWith('\n');
    });

    it('Given source contains no characters before new line, should write nothing to destination', () => {

        // Assert
        const source = getFakeSource(['\n']);
        const destination = getFakeDestination();
        const copier = createSUT(source, destination);

        // Act
        copier.Copy();

        // Assert
        expect(copier.destination.writeChar).not.toBeCalled();
    });


     each([[['\n', 'a', 'b', 'c'],['\n', 'a', 'b'],['\n', 'a']]])
    .it('Given source contains characters after new line, should write nothing to destination', (sourceData) => {

        // Assert
        const source = getFakeSource(sourceData);
        const destination = getFakeDestination();
        const copier = createSUT(source, destination);

        // Act
        copier.Copy();

        // Assert
        expect(copier.destination.writeChar).not.toBeCalled();
    });


    function getFakeDestination() {
        return {
            writeChar: jest.fn()
        };
    }

    function getFakeSource(characters: string[]) {
        let readChar = jest.fn();
        characters.forEach(element => {
            readChar.mockReturnValueOnce(element);
        });
        return { readChar };
    }


    function createSUT(source: { readChar: jest.Mock<any, any>; }, destination: { writeChar: jest.Mock<any, any>; }) {
        return new Copier(source, destination);
    }

});


class Copier {
    source: ISource;
    destination: IDestination;

    constructor(source: ISource, destination: IDestination) {
        this.source = source;
        this.destination = destination;
    }

    Copy() {
        let char!: string;
        while (this.isNotNewLine(char)) {

            char = this.source.readChar();

            if (this.isNotNewLine(char)) {
                this.destination.writeChar(char);
            }
        }
    }

    private isNotNewLine(char: string) {
        return char !== '\n';
    }
}

interface ISource {
    readChar();
}

interface IDestination {
    writeChar(char: string);
}



