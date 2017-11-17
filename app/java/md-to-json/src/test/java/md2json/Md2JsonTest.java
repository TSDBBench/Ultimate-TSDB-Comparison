package md2json;

import org.junit.Test;

import static org.junit.Assert.*;

public class Md2JsonTest {

    @Test
    public void testCreateSyntaxTree() {
        Md2Json m2j = new Md2Json();
        m2j.setLevel(1);
        m2j.setPrettyPrinting(true);
        String mdSource = "# Blueflood - http://blueflood.io\nTest Description\n\n## Properties\n- Aplha\n- beta\n- gamma\n\n## Description\n this is complete nonsense!\n\n## Test\n\n## Features\n";
        assertTrue("someLibraryMethod should return 'true'", m2j.toJSON(mdSource) != "");
    }

    @Test
    public void testMain() {
        String[] args = {"test", "1", "true"};
        Md2Json.main(args);
    }

}
