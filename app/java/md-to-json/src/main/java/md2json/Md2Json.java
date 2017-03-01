package md2json;

import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.pegdown.PegDownProcessor;
import org.pegdown.ast.RootNode;

public class Md2Json {
    private PegDownProcessor pdpc;
    private RootNode root;
    private ToJSONSerializer jsonSer;
    private Boolean prettyPrinting = false;

    public Md2Json() {
        pdpc = new PegDownProcessor();
        // ToHtmlSerializer test = new ToHtmlSerializer(new LinkRenderer());
        jsonSer = new ToJSONSerializer();
    }

    public static void main(String args[]) {
        Md2Json md2json = new Md2Json();
        if (args.length > 1) {
            md2json.setLevel(Integer.parseInt(args[1]));
        }

        if (args.length > 2) {
            md2json.setPrettyPrinting(Boolean.parseBoolean(args[2]));
        }

        if (args.length > 0) {
            System.out.println(md2json.toJSON(args[0]));
        }
    }

    private boolean createSyntaxTree(char[] mdSource) {
        root = pdpc.parseMarkdown(mdSource);
        jsonSer.setRaw(mdSource);
        return true;
    }

    public void setLevel(int level) {
        jsonSer.setLEVEL(level);
    }

    public String toJSON(String md) {
        this.createSyntaxTree(md.toCharArray());
        String json = jsonSer.toJSON(root);
        JsonParser jsonParser = new JsonParser();
        try {
            JsonObject jsonObject = (JsonObject) jsonParser.parse(json);
            String result = new GsonBuilder().setPrettyPrinting().create().toJson(jsonObject);
            if (prettyPrinting) {
                return result;
            }
            return jsonObject.toString();
        } catch (Exception e) {
            System.err.println(json);
            e.printStackTrace();
            throw e;
        }
    }

    public void setPrettyPrinting(Boolean prettyPrinting) {
        this.prettyPrinting = prettyPrinting;
    }
}
