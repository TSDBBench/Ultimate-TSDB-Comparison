package md2json;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;

import org.pegdown.ast.*;

import static org.parboiled.common.Preconditions.checkArgNotNull;

public class ToJSONSerializer implements Visitor {
    protected final Map<String, ReferenceNode> references = new HashMap<String, ReferenceNode>();
    protected final Map<String, String> abbreviations = new HashMap<String, String>();
    protected JSONPrinter printer = new JSONPrinter();
    protected TableNode currentTableNode;
    protected int currentTableColumn;
    protected boolean inTableHeder;
    protected char[] raw;
    protected RootNode astRoot = new RootNode();
    private int LEVEL = 0;

    public ToJSONSerializer() {
    }

    public String toJSON(RootNode astRoot) {
        checkArgNotNull(astRoot, "astRoot");
        astRoot = (RootNode) refactorAst(astRoot);
        printer.print('{');
        astRoot.accept(this);
        printer.print('}');
        return printer.getString();
    }

    protected Node refactorAst(Node node) {
        // copy childs
        List<Node> root_childs = new ArrayList<Node>(node.getChildren());
        ListIterator<Node> root_childIt = root_childs.listIterator();

        // clear old child list
        node.getChildren().clear();
        Node root_node = node;

        while (root_childIt.hasNext()) {
            Node root_childNode = root_childIt.next();

            // add all childs except childs that belong to a header
            root_node.getChildren().add(root_childNode);

            // special treatment for HeaderNodes!: {First_Child: Header Text,
            // Second_Child: Header Description, Else: other Headers}
            if (root_childNode instanceof HeaderNode) {
                int level = ((HeaderNode) root_childNode).getLevel();
                // create super child for current childs (copy clear copy)
                List<Node> current_childs = new ArrayList<Node>(root_childNode.getChildren());
                root_childNode.getChildren().clear();
                SuperNode headerText = new SuperNode(current_childs);
                headerText.setStartIndex(root_childNode.getStartIndex());
                headerText.setEndIndex(root_childNode.getEndIndex());
                root_childNode.getChildren().add(headerText);

                // add all siblings that are no headers to a super_child
                SuperNode headerDescription = new SuperNode();
                headerDescription.setStartIndex(headerText.getEndIndex());
                headerDescription.setEndIndex(headerText.getEndIndex());
                while (root_childIt.hasNext()) {
                    Node next = root_childIt.next();
                    if (!(next instanceof HeaderNode)) {
                        headerDescription.getChildren().add(next);
                        headerDescription.setEndIndex(next.getEndIndex());
                    } else {
                        root_childIt.previous();
                        break;
                    }
                }
                root_childNode.getChildren().add(headerDescription);

                // add all siblings that belong to this child header node
                while (root_childIt.hasNext()) {
                    Node next = root_childIt.next();
                    if (!((next instanceof HeaderNode) && level >= ((HeaderNode) next).getLevel())) {
                        root_childNode.getChildren().add(next);
                        ((HeaderNode) root_childNode).setEndIndex(next.getEndIndex());
                    } else {
                        root_childIt.previous();
                        break;
                    }
                }
            }
        }

        // Recursive refactoring
        root_childs = new ArrayList<Node>(root_node.getChildren());
        root_node.getChildren().clear();
        for (Node childNode : root_childs) {
            root_node.getChildren().add(refactorAst(childNode));
        }

        return root_node;
    }

    public void visit(RootNode node) {
        for (ReferenceNode refNode : node.getReferences()) {
            visitChildren(refNode);
            references.put(normalize(printer.getString()), refNode);
            printer.clear();
        }
        for (AbbreviationNode abbrNode : node.getAbbreviations()) {
            visitChildren(abbrNode);
            String abbr = printer.getString();
            printer.clear();
            abbrNode.getExpansion().accept(this);
            String expansion = printer.getString();
            abbreviations.put(abbr, expansion);
            printer.clear();
        }

        visitChildren(node);
    }

    // helpers
    protected void visitChildren(SuperNode node) {
        for (Node child : node.getChildren()) {
            child.accept(this);
        }

        if (node.getChildren().size() == 0) {
            printer.print("\"\"");
        }
    }

    // helpers
    protected void visitChildrenSkipFirst(SuperNode node) {
        boolean first = true;
        for (Node child : node.getChildren()) {
            if (!first)
                child.accept(this);
            first = false;
        }
    }

    // helpers
    protected void visitChildrenSkipN(SuperNode node, int N) {
        boolean skipping = true;
        int skip = 0;
        for (Node child : node.getChildren()) {
            skipping = (skip < N);
            if (!skipping)
                child.accept(this);
            else
                skip++;
        }
    }

    // helpers
    protected void visitChildrenFirstN(SuperNode node, int N) {
        int skip = 0;
        for (Node child : node.getChildren()) {
            if (skip++ >= N) {
                break;
            }
            child.accept(this);
        }
    }

    // helpers
    protected void visitChildN(SuperNode node, int N) {
        int skip = 0;
        for (Node child : node.getChildren()) {
            if (skip > N) {
                break;
            } else if (skip++ == N) {
                child.accept(this);
            }
        }
    }

    protected String normalize(String string) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < string.length(); i++) {
            char c = string.charAt(i);
            switch (c) {
                case ' ':
                case '\n':
                case '\t':
                    continue;
            }
            sb.append(Character.toLowerCase(c));
        }
        return sb.toString();
    }

    @Override
    public void visit(AbbreviationNode node) {
        printer.printcm();
        printer.print('[');
        visitChildren(node);
        printer.print(']');
    }

    @Override
    public void visit(AnchorLinkNode node) {
        printer.print(node.getText());
    }

    @Override
    public void visit(AutoLinkNode node) {
        printer.print(node.getText());
    }

    @Override
    public void visit(BlockQuoteNode node) {
        printer.printcm();
        printer.print('[');
        printRaw(node);
        printer.print(']');
    }

    @Override
    public void visit(BulletListNode node) {
        printer.printcm();
        printer.print('[');
        visitChildren(node);
        printer.print(']');
    }

    @Override
    public void visit(CodeNode node) {
        printRaw(node);
    }

    @Override
    public void visit(DefinitionListNode node) {
        printer.printcm();
        printer.print('[');
        visitChildren(node);
        printer.print(']');
    }

    @Override
    public void visit(DefinitionNode node) {
        printer.printcm();
        printer.print('[');
        visitChildren(node);
        printer.print(']');
    }

    @Override
    public void visit(DefinitionTermNode node) {
        printer.printcm();
        printer.print('[');
        visitChildren(node);
        printer.print(']');
    }

    @Override
    public void visit(ExpImageNode node) {
        printer.printcm();
        printer.print('[');
        visitChildren(node);
        printer.print(']');
    }

    @Override
    public void visit(ExpLinkNode node) {
        printer.printcm();
        printer.print('[');
        visitChildren(node);
        printer.print(']');
    }

    @Override
    public void visit(HeaderNode node) {
        int level = node.getLevel();
        if (level == LEVEL) {
            printer.printcm();
            visitFirstHeader(node);
            visitChildrenSkipN(node, 2);
        } else {
            printer.printcm();
            printer.printqt();
            visitChildrenFirstN(node, 1);
            printer.printqt();
            printer.print(":{\"plain\":\"");
            printChildrenRawSkip(node, 1);
            printer.print('"');
            printer.printcm();
            printer.print("\"childs\":{");
            String res = printChildN(node, 1);
            printer.print("\"0\":[");
            printer.print(res);
            printer.print(']');

            visitChildrenSkipN(node, 2);
            printer.print("}}");
        }
    }

    public void visitFirstHeader(HeaderNode node) {
        Iterator<Node> nodeIt = node.getChildren().iterator();
        int count = 0;
        while (nodeIt.hasNext() && count < 2) {
            Node child = nodeIt.next();
            if (count == 0 && child instanceof SuperNode) {
                printSimpleTag(printChildrenToString((SuperNode) child), "tag");
            } else if (count == 1 && child instanceof SuperNode) {
                printer.printcm();
                printer.print("\"descr\":");
                visit(child);
                //printSimpleTag(printChildrenToString((SuperNode) child), "descr");
            }
            count++;
        }
    }

    @Override
    public void visit(HtmlBlockNode node) {
        printer.print(node.getText());
    }

    @Override
    public void visit(InlineHtmlNode node) {
        printer.print(node.getText());
    }

    @Override
    public void visit(ListItemNode node) {
        /*printer.printcm();
		printer.print('"');
		visitChildren(node);
		printer.print('"');
		*/
        printer.printcm();
        printer.print('{');
        printer.print("\"content\":\"");
        visitChildrenFirstN(node, 1);
        printer.print('"');
        printer.printcm();

        printer.print("\"plain\":\"");
        printChildrenRawN(node, 0);
        printer.print('"');
        printer.printcm();

        printer.print("\"plainChilds\":\"");
        printChildrenRawSkip(node, 1);
        printer.print('"');
        printer.printcm();

        printer.print("\"childs\":");
        visitChildrenSkipN(node, 1);
        if (node.getChildren().size() <= 1) {
            printer.print("[]");
        }

        printer.print('}');
    }

    @Override
    public void visit(MailLinkNode node) {
        printer.print(node.getText());
    }

    @Override
    public void visit(OrderedListNode node) {
        printer.printcm();
        printer.print('[');
        visitChildren(node);
        printer.print(']');
    }

    @Override
    public void visit(ParaNode node) {
        printer.printcm();

        String res = printChildrenToString(node);
        if (res == "") {
            printer.print("\"\"");
        } else {
            printer.printqt();
            printer.print(res);
            printer.printqt();
        }
    }

    @Override
    public void visit(QuotedNode node) {
        printer.printcm();
        printer.print('[');
        visitChildren(node);
        printer.print(']');
    }

    @Override
    public void visit(ReferenceNode node) {
        printer.printcm();
        printer.print('[');
        visitChildren(node);
        printer.print(']');
    }

    @Override
    public void visit(RefImageNode node) {
        printer.printcm();
        printer.print('[');
        visitChildren(node);
        printer.print(']');
    }

    @Override
    public void visit(RefLinkNode node) {
        printer.printcm();
        printer.print('[');
        visitChildren(node);
        printer.print(']');
    }

    @Override
    public void visit(SimpleNode node) {
        switch (node.getType()) {
            case Apostrophe:
                printer.print("&rsquo;");
                break;
            case Ellipsis:
                printer.print("&hellip;");
                break;
            case Emdash:
                printer.print("&mdash;");
                break;
            case Endash:
                printer.print("&ndash;");
                break;
            case HRule:
                printer.println().print("<hr/>");
                break;
            case Linebreak:
                printer.print("<br/>");
                break;
            case Nbsp:
                printer.print("&nbsp;");
                break;
            default:
                throw new IllegalStateException();
        }
    }

    @Override
    public void visit(SpecialTextNode node) {
        printer.print(node.getText());
    }

    @Override
    public void visit(StrikeNode node) {
        printer.print(node.getChars());
    }

    @Override
    public void visit(StrongEmphSuperNode node) {
        printRaw(node);
    }

    @Override
    public void visit(TableBodyNode node) {
        printer.printcm();
        printer.print('[');
        visitChildren(node);
        printer.print(']');
    }

    @Override
    public void visit(TableCaptionNode node) {
        printer.printcm();
        printer.print('[');
        visitChildren(node);
        printer.print(']');
    }

    @Override
    public void visit(TableCellNode node) {
        printer.printcm();
        printer.print('[');
        visitChildren(node);
        printer.print(']');
    }

    @Override
    public void visit(TableColumnNode node) {
        printer.printcm();
        printer.print('[');
        visitChildren(node);
        printer.print(']');
    }

    @Override
    public void visit(TableHeaderNode node) {
        printer.printcm();
        printer.print('[');
        visitChildren(node);
        printer.print(']');
    }

    @Override
    public void visit(TableNode node) {
        printer.printcm();
        printer.print('[');
        visitChildren(node);
        printer.print(']');
    }

    @Override
    public void visit(TableRowNode node) {
        printer.printcm();
        printer.print('[');
        visitChildren(node);
        printer.print(']');
    }

    @Override
    public void visit(VerbatimNode node) {
        printer.print(node.getText());
    }

    @Override
    public void visit(WikiLinkNode node) {
        printer.print(node.getText());
    }

    @Override
    public void visit(TextNode node) {
        printer.print(node.getText());
    }

    @Override
    public void visit(SuperNode node) {
        visitChildren(node);
    }

    @Override
    public void visit(Node node) {
        if (node instanceof SuperNode) {
            visit((SuperNode) node);
        } else if (node instanceof TextNode) {
            visit((TextNode) node);
        }
    }

    protected String printChildrenToString(SuperNode node) {
        JSONPrinter priorPrinter = printer;
        printer = new JSONPrinter();
        visitChildren(node);
        String result = printer.getString();
        printer = priorPrinter;
        return result;
    }

    protected String printNode(Node node) {
        JSONPrinter priorPrinter = printer;
        printer = new JSONPrinter();
        visit(node);
        String result = printer.getString();
        printer = priorPrinter;
        return result;
    }

    protected String printChildN(SuperNode node, int N) {
        JSONPrinter priorPrinter = printer;
        printer = new JSONPrinter();
        visitChildN(node, N);
        String result = printer.getString();
        printer = priorPrinter;
        return result;
    }

    protected void printRaw(Node node) {
        printer.print(String.valueOf(Arrays.copyOfRange(raw, node.getStartIndex(), node.getEndIndex())));
    }

    protected void printChildrenRawSkip(Node node, int N) {
        int skip = 0;
        for (Node child : node.getChildren()) {
            if (skip++ >= N) {
                int index = child.getStartIndex();
                while (index > 0 && index < raw.length && (raw[index] != '\n')) {
                    index--;
                }
                if (index < raw.length && raw[index] == '\n') {
                    index++;
                }
                if (index < raw.length && index <= child.getEndIndex()) {
                    printer.print(String.valueOf(Arrays.copyOfRange(raw, index, child.getEndIndex())));
                }
            }
        }
    }

    protected void printChildrenRawN(Node node, int N) {
        int skip = 0;
        for (Node child : node.getChildren()) {
            if (skip++ == N) {
                printer.print(String.valueOf(Arrays.copyOfRange(raw, child.getStartIndex(), child.getEndIndex())));
            }
        }
    }

    protected void printSimpleTag(String text, String tag) {
        printer.printcm();
        printer.print('"');
        printer.print(tag);
        printer.print('"');
        printer.print(':');
        if (text == "") {
            printer.print("\"\"");
        } else {
            printer.printqt();
            printer.print(text);
            printer.printqt();
        }
    }

    public String toString() {
        return printer.getString();
    }

    public void setRaw(char[] raw) {
        this.raw = raw;
    }

    public int getLEVEL() {
        return LEVEL;
    }

    public void setLEVEL(int lEVEL) {
        LEVEL = lEVEL;
    }
}
