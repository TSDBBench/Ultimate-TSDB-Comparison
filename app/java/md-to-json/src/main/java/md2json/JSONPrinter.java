package md2json;

import org.pegdown.Printer;

public class JSONPrinter extends Printer {
    public boolean endsWith(char tag) {
        int iMax = sb.length();

        for (int i = iMax; i-- > 0; ) {
            if (sb.charAt(i) != ' ') {
                return sb.charAt(i) == tag;
            }
        }
        // all leading spaces
        return false;
    }

    public Printer printcm() {
        if (!endsWith(',') && !endsWith('{') && !endsWith('[') && (endsWith('}') || endsWith(']') || endsWith('"'))) {
            if (sb.length() > 0) {
                print(",");
            }


            for (int i = 0; i < indent; i++)
                print(' ');
        }
        return this;
    }

    public Printer printqt() {
        if (!endsWith('"')) {
            print('"');
            for (int i = 0; i < indent; i++)
                print(' ');
        }
        return this;
    }
}
